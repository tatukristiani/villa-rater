import React, { useState } from "react";

interface CreateGroupPageProps {
  onBack: () => void;
  onCreate: (groupName: string) => void;
}

export const CreateGroupPage: React.FC<CreateGroupPageProps> = ({
  onBack,
  onCreate,
}) => {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim()) {
      onCreate(groupName.trim());
    }
  };

  return (
    <>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        <i className="bi bi-arrow-left"></i> Back
      </button>

      <div className="glass-card">
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "var(--primary-gold)",
          }}
        >
          Create New Group
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                color: "var(--text-muted)",
                display: "block",
                marginBottom: "10px",
              }}
            >
              Group Name
            </label>
            <input
              type="text"
              className="luxury-input"
              placeholder="Summer Villa Selection"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              minLength={3}
              maxLength={50}
            />
          </div>
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "14px",
              marginBottom: "20px",
            }}
          >
            <i className="bi bi-info-circle"></i> All available villas will be
            included
          </p>
          <button type="submit" className="btn-luxury">
            Create Group <i className="bi bi-check-circle"></i>
          </button>
        </form>
      </div>
    </>
  );
};
