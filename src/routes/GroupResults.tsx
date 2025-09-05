import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Villa, VillaImage, VillaDateOption, Rating } from "../types";

interface VillaResult extends Villa {
  avgRating: number;
  ratingCount: number;
  images: VillaImage[];
  mostSelectedDate?: VillaDateOption;
}

export default function GroupResults() {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<VillaResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedVilla, setExpandedVilla] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, [id]);

  const fetchResults = async () => {
    // Get all ratings for this group
    const { data: ratings } = await supabase
      .from("ratings")
      .select("*")
      .eq("group_id", id);

    if (!ratings) return;

    // Group ratings by villa
    const villaRatings = ratings.reduce((acc, rating) => {
      if (!acc[rating.villaId]) {
        acc[rating.villaId] = [];
      }
      acc[rating.villaId].push(rating);
      return acc;
    }, {} as Record<string, Rating[]>);

    // Get villa details and calculate averages
    const villaResults: VillaResult[] = [];

    for (const villaId of Object.keys(villaRatings)) {
      const { data: villa } = await supabase
        .from("villas")
        .select("*")
        .eq("id", villaId)
        .single();

      if (!villa) continue;

      const { data: images } = await supabase
        .from("villa_images")
        .select("*")
        .eq("villa_id", villaId);

      const ratings = villaRatings[villaId];
      const avgRating =
        ratings.reduce((sum: number, r: Rating) => sum + r.stars, 0) /
        ratings.length;

      // Find most selected date
      const dateFrequency = ratings.reduce(
        (acc: Record<string, number>, r: Rating) => {
          if (r.date_option_id) {
            acc[r.date_option_id] = (acc[r.date_option_id] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>
      );

      let mostSelectedDate;
      if (Object.keys(dateFrequency).length > 0) {
        const mostSelectedId = (
          Object.entries(dateFrequency) as [string, number][]
        ).sort((a, b) => b[1] - a[1])[0][0];
        const { data: dateOption } = await supabase
          .from("villa_date_options")
          .select("*")
          .eq("id", mostSelectedId)
          .single();
        mostSelectedDate = dateOption;
      }

      villaResults.push({
        ...villa,
        avgRating,
        ratingCount: ratings.length,
        images: images || [],
        mostSelectedDate,
      });
    }

    // Sort by average rating
    villaResults.sort((a, b) => b.avgRating - a.avgRating);
    setResults(villaResults);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading results...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Rating Results</h1>

      <div className="space-y-4">
        {results.map((villa, index) => (
          <div key={villa.id} className="card">
            <div
              className="cursor-pointer"
              onClick={() =>
                setExpandedVilla(expandedVilla === villa.id ? null : villa.id)
              }
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-2xl font-bold text-gray-400">
                  #{index + 1}
                </div>

                {villa.images[0] && (
                  <img
                    src={villa.images[0].url}
                    alt={villa.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}

                <div className="flex-1">
                  <h2 className="text-xl font-bold">{villa.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {villa.city}, {villa.country}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5"
                          fill={
                            i < Math.floor(villa.avgRating) ? "#fbbf24" : "none"
                          }
                          stroke="#fbbf24"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                      <span className="font-medium">
                        {villa.avgRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({villa.ratingCount} votes)
                      </span>
                    </div>

                    {villa.mostSelectedDate && (
                      <div className="text-sm">
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          €
                          {(villa.mostSelectedDate.price_cents / 100).toFixed(2)}
                        </span>
                        <span className="text-gray-500 ml-1">
                          {new Date(
                            villa.mostSelectedDate.start_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <svg
                  className={`w-6 h-6 text-gray-400 transition-transform ${
                    expandedVilla === villa.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {expandedVilla === villa.id && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  {villa.images.map((image) => (
                    <img
                      key={image.id}
                      src={image.url}
                      alt={image.alt || "Villa image"}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>

                {villa.description && (
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    {villa.description}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  {villa.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a href="/" className="btn-primary">
          Create New Rating Session
        </a>
      </div>
    </div>
  );
}
