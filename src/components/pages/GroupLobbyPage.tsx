import React from "react";
import { Profile } from "../../types";
import { getInitials } from "../../utils/helpers";

interface GroupLobbyPageProps {
  groupName: string;
  joinCode: string;
  members: Profile[];
  isCreator: boolean;
  currentUserId: string;
  onLeave: () => void;
  onStart: () => void;
}

export const GroupLobbyPage: React.FC<GroupLobbyPageProps> = ({
  groupName,
  joinCode,
  members,
  isCreator,
  currentUserId,
  onLeave,
  onStart,
}) => {
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCreator && (
        <div className="glass-card">
          <button className="btn-luxury" onClick={onStart}>
            <i className="bi bi-play-fill"></i> Start Rating
          </button>
        </div>
      )}
    </>
  );
};
