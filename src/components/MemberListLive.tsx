import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { GroupMember } from "../types";

interface MemberListLiveProps {
  groupId: string;
  className?: string;
}

export default function MemberListLive({
  groupId,
  className = "",
}: MemberListLiveProps) {
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();

    const channel = supabase
      .channel(`group-members-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_members",
          filter: `group_id=eq.${groupId}`,
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  const fetchMembers = async () => {
    const { data } = await supabase
      .from("group_members")
      .select("*, profiles!inner(username)")
      .eq("group_id", groupId);

    if (data) {
      setMembers(
        data.map((m) => ({
          ...m,
          username: m.profiles?.username,
        }))
      );
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="font-medium mb-2">Members ({members.length})</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.userId}
            className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {member.username?.charAt(0).toUpperCase()}
            </div>
            <span className="font-medium">{member.username}</span>
            <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
              Joined {new Date(member.joinedAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
