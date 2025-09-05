import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useStore } from "../store/store";
import { nanoid } from "nanoid";
import type { Villa, VillaFilters } from "../types";

// Create a new group and select villas based on filters
export default function CreateGroup() {
  const navigate = useNavigate();
  const { user } = useStore();
  const [loading, setLoading] = useState(false);
  const [villas, setVillas] = useState<Villa[]>([]);
  const [filteredVillas, setFilteredVillas] = useState<Villa[]>([]);

  const [groupName, setGroupName] = useState("");
  const [filters, setFilters] = useState<VillaFilters>({
    countries: [],
    cities: [],
    smoking_allowed: undefined,
    max_price: undefined,
  });

  const [availableCountries, setAvailableCountries] = useState<string[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  useEffect(() => {
    fetchVillas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, villas]);

  const fetchVillas = async () => {
    const { data } = await supabase.from("villas").select("*").order("title");

    if (data) {
      setVillas(data);
      const countries = [...new Set(data.map((v) => v.country))];
      const cities = [...new Set(data.map((v) => v.city))];
      setAvailableCountries(countries);
      setAvailableCities(cities);
    }
  };

  const applyFilters = () => {
    let filtered = [...villas];

    if (filters.countries.length > 0) {
      filtered = filtered.filter((v) => filters.countries.includes(v.country));
    }

    if (filters.cities.length > 0) {
      filtered = filtered.filter((v) => filters.cities.includes(v.city));
    }

    if (filters.smoking_allowed !== undefined) {
      filtered = filtered.filter(
        (v) => v.smoking_allowed === filters.smoking_allowed
      );
    }

    setFilteredVillas(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) return;
    if (filteredVillas.length === 0) {
      alert("No villas match your filters. Please adjust them.");
      return;
    }

    setLoading(true);

    try {
      const joinCode = nanoid(6).toUpperCase();

      // Create group
      const { data: group, error: groupError } = await supabase
        .from("groups")
        .insert({
          name: groupName,
          creator_id: user!.id,
          join_code: joinCode,
          status: "lobby",
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Join as member
      await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: user!.id,
      });

      // Add villas to group
      const groupVillas = filteredVillas.map((villa, index) => ({
        group_id: group.id,
        villa_id: villa.id,
        position: index,
      }));

      await supabase.from("group_villas").insert(groupVillas);

      // Initialize progress
      await supabase.from("group_progress").insert({
        group_id: group.id,
        current_index: 0,
      });

      useStore.getState().setCurrentGroup(group);
      navigate(`/group/${group.id}/lobby`);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Rating Group</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="input-field"
            placeholder="Summer Villas 2025"
            required
            maxLength={50}
          />
        </div>

        <div className="card">
          <h2 className="text-lg font-medium mb-4">Villa Filters</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Countries
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCountries.map((country) => (
                  <button
                    key={country}
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        countries: prev.countries.includes(country)
                          ? prev.countries.filter((c) => c !== country)
                          : [...prev.countries, country],
                      }));
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.countries.includes(country)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Cities</label>
              <div className="flex flex-wrap gap-2">
                {availableCities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setFilters((prev) => ({
                        ...prev,
                        cities: prev.cities.includes(city)
                          ? prev.cities.filter((c) => c !== city)
                          : [...prev.cities, city],
                      }));
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.cities.includes(city)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Smoking Policy
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      smokingAllowed: undefined,
                    }))
                  }
                  className={`px-4 py-2 rounded-lg ${
                    filters.smoking_allowed === undefined
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  Any
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, smokingAllowed: true }))
                  }
                  className={`px-4 py-2 rounded-lg ${
                    filters.smoking_allowed === true
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  Smoking Allowed
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, smokingAllowed: false }))
                  }
                  className={`px-4 py-2 rounded-lg ${
                    filters.smoking_allowed === false
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  No Smoking
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <p className="text-sm">
              <span className="font-medium">
                {filteredVillas.length} villas
              </span>{" "}
              match your filters
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={
              loading || !groupName.trim() || filteredVillas.length === 0
            }
            className="btn-primary flex-1"
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
