import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface WaitingPageProps {
  groupId: string;
  totalVillas: number;
  totalMembers: number;
  currentUserId: string;
  onComplete: () => void;
}

export const WaitingPage: React.FC<WaitingPageProps> = ({
  groupId,
  totalVillas,
  totalMembers,
  onComplete,
}) => {
  const [finishedMembers, setFinishedMembers] = useState<string[]>([]);
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    // Check completion status every 2 seconds
    const interval = setInterval(async () => {
      await checkCompletionStatus();
    }, 2000);

    setCheckInterval(interval);

    // Initial check
    checkCompletionStatus();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [groupId, totalVillas, totalMembers]);

  const checkCompletionStatus = async () => {
    // Get all ratings for this group
    const { data: ratings } = await supabase
      .from("ratings")
      .select("user_id")
      .eq("group_id", groupId);

    if (!ratings) return;

    // Count ratings per user
    const userRatingCounts: Record<string, number> = {};
    ratings.forEach((rating) => {
      userRatingCounts[rating.user_id] =
        (userRatingCounts[rating.user_id] || 0) + 1;
    });

    // Find users who have rated all villas
    const completedUsers = Object.entries(userRatingCounts)
      .filter(([_, count]) => count >= totalVillas)
      .map(([userId]) => userId);

    setFinishedMembers(completedUsers);

    // Check if all members have finished
    if (completedUsers.length >= totalMembers) {
      if (checkInterval) clearInterval(checkInterval);
      setTimeout(() => {
        onComplete();
      }, 500); // Small delay for better UX
    }
  };

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
          {finishedMembers.length} of {totalMembers} members finished
        </small>
      </div>
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            background: "rgba(212, 175, 55, 0.1)",
            height: "8px",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "var(--primary-gold)",
              height: "100%",
              width: `${(finishedMembers.length / totalMembers) * 100}%`,
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};
