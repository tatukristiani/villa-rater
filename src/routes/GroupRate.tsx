import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useStore } from "../store/store";
import ImageCarousel from "../components/ImageCarousel";
import DateSelector from "../components/DateSelector";
import StarRating from "../components/StarRating";
import MapView from "../components/MapView";
import WaitOverlay from "../components/WaitOverlay";
import type {
  Villa,
  VillaImage,
  VillaDateOption,
  GroupProgress,
} from "../types";

export default function GroupRate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useStore();

  const [villa, setVilla] = useState<Villa | null>(null);
  const [images, setImages] = useState<VillaImage[]>([]);
  const [dateOptions, setDateOptions] = useState<VillaDateOption[]>([]);
  const [progress, setProgress] = useState<GroupProgress | null>(null);
  const [totalVillas, setTotalVillas] = useState(0);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [allRated, setAllRated] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetchCurrentVilla();
    subscribeToUpdates();
  }, [id]);

  useEffect(() => {
    if (progress !== null) {
      fetchCurrentVilla();
    }
  }, [progress?.current_index]);

  const fetchCurrentVilla = async () => {
    // Get progress
    const { data: progressData } = await supabase
      .from("group_progress")
      .select("*")
      .eq("group_id", id)
      .single();

    if (!progressData) return;
    setProgress(progressData);

    // Get total villas
    const { count } = await supabase
      .from("group_villas")
      .select("*", { count: "exact", head: true })
      .eq("group_id", id);

    setTotalVillas(count || 0);

    // Get current villa
    const { data: groupVilla } = await supabase
      .from("group_villas")
      .select("*")
      .eq("group_id", id)
      .eq("position", progressData.currentIndex)
      .single();

    if (!groupVilla) {
      // All villas rated
      navigate(`/group/${id}/results`);
      return;
    }

    // Get villa details
    const { data: villaData } = await supabase
      .from("villas")
      .select("*")
      .eq("id", groupVilla.villaId)
      .single();

    if (villaData) {
      setVilla(villaData);

      // Get images
      const { data: imagesData } = await supabase
        .from("villa_images")
        .select("*")
        .eq("villa_id", villaData.id);

      setImages(imagesData || []);

      // Get date options
      const { data: datesData } = await supabase
        .from("villa_date_options")
        .select("*")
        .eq("villa_id", villaData.id)
        .order("start_date");

      setDateOptions(datesData || []);

      // Check if already rated
      const { data: existingRating } = await supabase
        .from("ratings")
        .select("*")
        .eq("group_id", id)
        .eq("villa_id", villaData.id)
        .eq("user_id", user!.id)
        .single();

      if (existingRating) {
        setRating(existingRating.stars);
        setComment(existingRating.comment || "");
        setSelectedDate(existingRating.dateOptionId || "");
        setSubmitted(true);
        checkAllRated(villaData.id);
      } else {
        setRating(0);
        setComment("");
        setSelectedDate("");
        setSubmitted(false);
      }
    }
  };

  const subscribeToUpdates = () => {
    const channel = supabase
      .channel(`rating-${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ratings",
          filter: `group_id=eq.${id}`,
        },
        () => {
          if (submitted && villa) {
            checkAllRated(villa.id);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "group_progress",
          filter: `group_id=eq.${id}`,
        },
        (payload) => {
          setProgress(payload.new as GroupProgress);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const checkAllRated = async (villaId: string) => {
    // Get member count
    const { count: memberCount } = await supabase
      .from("group_members")
      .select("*", { count: "exact", head: true })
      .eq("group_id", id);

    // Get rating count
    const { count: ratingCount } = await supabase
      .from("ratings")
      .select("*", { count: "exact", head: true })
      .eq("group_id", id)
      .eq("villa_id", villaId);

    if (memberCount === ratingCount) {
      setAllRated(true);
      setWaiting(false);
    } else {
      setWaiting(true);
    }
  };

  const handleSubmit = async () => {
    if (!villa || rating === 0) return;

    try {
      await supabase.from("ratings").insert({
        group_id: id,
        villa_id: villa.id,
        user_id: user!.id,
        date_option_id: selectedDate || null,
        stars: rating,
        comment: comment || null,
      });

      setSubmitted(true);
      checkAllRated(villa.id);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating");
    }
  };

  const handleNext = async () => {
    if (!progress) return;

    const newIndex = progress.current_index + 1;

    if (newIndex >= totalVillas) {
      // All villas rated
      await supabase.from("groups").update({ status: "finished" }).eq("id", id);

      navigate(`/group/${id}/results`);
    } else {
      // Go to next villa
      await supabase
        .from("group_progress")
        .update({ current_index: newIndex })
        .eq("group_id", id);

      setAllRated(false);
      setWaiting(false);
    }
  };

  if (!villa) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {waiting && (
        <WaitOverlay
          message="Waiting for all members to rate this villa..."
          subMessage={`Villa ${
            (progress?.current_index || 0) + 1
          } of ${totalVillas}`}
        />
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{villa.title}</h1>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Villa {(progress?.current_index || 0) + 1} of {totalVillas}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{
              width: `${
                (((progress?.current_index || 0) + 1) / totalVillas) * 100
              }%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <ImageCarousel images={images} className="aspect-video" />

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Location</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">
                {villa.city}, {villa.country}
              </p>
              {villa.address && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {villa.address}
                </p>
              )}
            </div>
            {villa.latitude && villa.longitude && (
              <MapView
                latitude={villa.latitude}
                longitude={villa.longitude}
                title={villa.title}
                address={villa.address}
                className="h-48"
              />
            )}
          </div>
        </div>

        {villa.description && (
          <div className="card">
            <h2 className="text-lg font-medium mb-2">Description</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {villa.description}
            </p>
          </div>
        )}

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Amenities</h2>
          <div className="flex flex-wrap gap-2">
            {villa.amenities.map((amenity, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm"
              >
                {amenity}
              </span>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                villa.smoking_allowed
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              }`}
            >
              {villa.smoking_allowed ? "🚬 Smoking allowed" : "🚭 No smoking"}
            </span>
          </div>
        </div>

        {villa.nearby && (
          <div className="card">
            <h2 className="text-lg font-medium mb-2">Nearby Attractions</h2>
            <p className="text-gray-600 dark:text-gray-400">{villa.nearby}</p>
          </div>
        )}

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Select Week</h2>
          <DateSelector
            options={dateOptions}
            value={selectedDate}
            onChange={setSelectedDate}
            disabled={submitted}
          />
        </div>

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Your Rating</h2>
          <StarRating
            value={rating}
            onChange={setRating}
            disabled={submitted}
            size="lg"
          />

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Comments (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input-field"
              rows={3}
              disabled={submitted}
              placeholder="Share your thoughts about this villa..."
            />
          </div>
        </div>

        <div className="pb-8">
          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="btn-primary w-full"
            >
              Submit Rating
            </button>
          )}

          {allRated && (
            <button onClick={handleNext} className="btn-primary w-full">
              {(progress?.current_index || 0) + 1 === totalVillas
                ? "View Results"
                : "Next Villa"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
