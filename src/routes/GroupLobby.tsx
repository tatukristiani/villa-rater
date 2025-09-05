import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useStore } from "../store/store";
import MemberListLive from "../components/MemberListLive";
import type { Group } from "../types";

export default function GroupLobby() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useStore();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchGroup();

    const channel = supabase
      .channel(`group-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "groups",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log("Payload is " + JSON.stringify(payload));
          const updatedGroup = payload.new as Group;
          if (updatedGroup.status === "rating") {
            navigate(`/group/${id}/rate`);
          }
          setGroup(updatedGroup);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, navigate]);

  const fetchGroup = async () => {
    const { data } = await supabase
      .from("groups")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setGroup(data);
      useStore.getState().setCurrentGroup(data);

      if (data.status === "rating") {
        navigate(`/group/${id}/rate`);
      } else if (data.status === "finished") {
        navigate(`/group/${id}/results`);
      }
    }
    setLoading(false);
  };

  const handleStart = async () => {
    setStarting(true);

    await supabase.from("groups").update({ status: "rating" }).eq("id", id);
  };

  const copyShareLink = () => {
    console.log("group data " + JSON.stringify(group));
    const url = `${window.location.origin}/join?code=${group?.join_code}`;
    navigator.clipboard.writeText(url);
    alert("Share link copied!");
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!group) {
    return <div className="text-center py-8">Group not found</div>;
  }

  const isCreator = group.creator_id === user?.id;
  console.log("group" + JSON.stringify(group));

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card mb-6">
        <h1 className="text-3xl font-bold mb-4">{group.name}</h1>

        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Join Code
          </div>
          <div className="text-3xl font-mono font-bold mb-3">
            {group.join_code}
          </div>
          <button
            onClick={copyShareLink}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Copy share link
          </button>
        </div>

        <MemberListLive groupId={group.id} />

        {isCreator && (
          <div className="mt-6">
            <button
              onClick={handleStart}
              disabled={starting}
              className="btn-primary w-full"
            >
              {starting ? "Starting..." : "Start Rating"}
            </button>
          </div>
        )}

        {!isCreator && (
          <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
            Waiting for the host to start the rating session...
          </div>
        )}
      </div>
    </div>
  );
}
