import React, { useEffect, useState } from "react";
import { Profile } from "../../types/types";
import { getInitials } from "../../utils/helpers";
import { supabase } from "../../lib/supabase";

interface GroupLobbyPageProps {
  groupId: string; // Add this prop
  groupName: string;
  joinCode: string;
  members: Profile[];
  isCreator: boolean; // Add this prop
  currentUserId: string;
  onLeave: () => void;
  onStart: () => void;
}

export const GroupLobbyPage: React.FC<GroupLobbyPageProps> = ({
  groupId,
  groupName,
  joinCode,
  members: initialMembers,
  isCreator,
  currentUserId,
  onLeave,
  onStart,
}) => {
  const [members, setMembers] = useState<Profile[]>(initialMembers);

  useEffect(() => {
    // Load initial members
    loadMembers();

    // Subscribe to real-time changes
    const channel = supabase
      .channel(`group-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_members",
          filter: `group_id=eq.${groupId}`,
        },
        () => {
          // Reload members when someone new joins
          loadMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  const loadMembers = async () => {
    const { data: memberData } = await supabase
      .from("group_members")
      .select("profiles(*)")
      .eq("group_id", groupId);

    const membersList =
      memberData?.map((m) => (m as any).profiles).filter(Boolean) || [];
    setMembers(membersList);
  };

  return (
    <>
      <button
        onClick={onLeave}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        <i className="bi bi-arrow-left"></i> Leave Group
      </button>

      <div className="glass-card" style={{ marginBottom: "15px" }}>
        <h2 style={{ textAlign: "center", color: "var(--primary-gold)" }}>
          {groupName}
        </h2>
        <div className="join-code-display">
          <p style={{ color: "var(--text-muted)", marginBottom: "10px" }}>
            Share this code:
          </p>
          <div className="join-code-text">{joinCode}</div>
        </div>
      </div>

      <div className="glass-card" style={{ marginBottom: "15px" }}>
        <h4 style={{ color: "var(--primary-gold)", marginBottom: "20px" }}>
          <i className="bi bi-people-fill"></i> Members ({members.length})
        </h4>
        <button className="btn-luxury" onClick={loadMembers}>
          <i className="bi bi-play-fill"></i> Refresh Members
        </button>
        <div>
          {members.map((member) => (
            <div key={member.id} className="member-item">
              <div className="member-avatar">
                {getInitials(member.username)}
              </div>
              <div>
                <div style={{ color: "var(--text-light)", fontWeight: 500 }}>
                  {member.username}
                </div>
                {member.id === currentUserId && (
                  <small style={{ color: "var(--primary-gold)" }}>You</small>
                )}
                {isCreator && member.id === currentUserId && (
                  <small style={{ color: "var(--primary-gold)" }}>
                    {" "}
                    (Host)
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card">
        <button className="btn-luxury" onClick={onStart}>
          <i className="bi bi-play-fill"></i> Start Rating
        </button>

        <p
          style={{
            textAlign: "center",

            marginTop: "15px",

            color: "var(--text-muted)",

            fontSize: "14px",
          }}
        >
          <i className="bi bi-info-circle"></i> Start when you're ready. You'll
          wait for others at the end.
        </p>
      </div>
    </>
  );
};
