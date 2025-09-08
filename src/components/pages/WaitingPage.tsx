import React from "react";

interface WaitingPageProps {
  finishedCount: number;
  totalMembers: number;
}

export const WaitingPage: React.FC<WaitingPageProps> = ({
  finishedCount,
  totalMembers,
}) => {
  return (
    <div
      className="glass-card"
      style={{ textAlign: "center", marginTop: "150px" }}
    >
      <div className="loading-spinner" style={{ marginBottom: "30px" }}></div>
      <h2 style={{ color: "var(--primary-gold)" }}>Almost Done!</h2>
      <p style={{ color: "var(--text-muted)" }}>
        Waiting for other members to finish rating...
      </p>
      <div style={{ marginTop: "20px" }}>
        <small style={{ color: "var(--text-muted)" }}>
          {finishedCount} of {totalMembers} members finished
        </small>
      </div>
    </div>
  );
};
