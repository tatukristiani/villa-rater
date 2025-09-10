import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Profile, Group, Villa } from "./types/types";
import { generateJoinCode } from "./utils/helpers";
import { Navigation } from "./components/Navigation";
import { Toast } from "./components/Toast";
import { LoginPage } from "./components/pages/LoginPage";
import { HomePage } from "./components/pages/HomePage";
import { CreateGroupPage } from "./components/pages/CreateGroupPage";
import { JoinGroupPage } from "./components/pages/JoinGroupPage";
import { GroupLobbyPage } from "./components/pages/GroupLobbyPage";
import { RatingPage } from "./components/pages/RatingPage";
import { WaitingPage } from "./components/pages/WaitingPage";
import { ResultsPage } from "./components/pages/ResultsPage";
import { VillaViewPage } from "./components/pages/VillaViewPage";

type Page =
  | "login"
  | "home"
  | "createGroup"
  | "joinGroup"
  | "lobby"
  | "rating"
  | "waiting"
  | "results"
  | "villaView";

interface AppState {
  currentPage: Page;
  currentUser: Profile | null;
  currentGroup: Group | null;
  villas: Villa[];
  currentVillaIndex: number;
  ratings: Record<string, number>;
  members: Profile[];
  isCreator: boolean;
  hasRatedCurrent: boolean;
  selectedVilla: (Villa & { avgRating?: number }) | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    currentPage: "login",
    currentUser: null,
    currentGroup: null,
    villas: [],
    currentVillaIndex: 0,
    ratings: {},
    members: [],
    isCreator: false,
    hasRatedCurrent: false,
    selectedVilla: null,
  });

  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    type: "success" as "success" | "error",
  });

  useEffect(() => {
    loadVillas();
    checkExistingSession();
  }, []);

  const loadVillas = async () => {
    // Fetch villas with their date ranges
    const { data, error } = await supabase
      .from("villas")
      .select(
        `
        *,
        villa_date_ranges (*)
      `
      )
      .order("created_at");

    if (!error && data) {
      setState((prev) => ({ ...prev, villas: data }));
    }
  };

  const checkExistingSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profile) {
        setState((prev) => ({
          ...prev,
          currentUser: profile,
          currentPage: "home",
        }));
      }
    }
  };

  const handleViewVilla = (villa: Villa & { avgRating: number }) => {
    setState((prev) => ({
      ...prev,
      selectedVilla: villa,
      currentPage: "villaView",
    }));
  };

  const showToast = (
    title: string,
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ show: true, title, message, type });
  };

  const handleLogin = async (username: string) => {
    // For demo purposes, using anonymous auth
    const { data: authData, error: authError } =
      await supabase.auth.signInAnonymously();

    if (authError) {
      showToast("Error", authError.message, "error");
      return;
    }

    if (authData.user) {
      // Create or update profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .upsert({
          user_id: authData.user.id,
          username: username,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (profileError) {
        showToast("Error", "Failed to create profile", "error");
        return;
      }

      setState((prev) => ({
        ...prev,
        currentUser: profile,
        currentPage: "home",
      }));
      showToast("Welcome!", `Logged in as ${username}`);
    }
  };

  const handleCreateGroup = async (groupName: string) => {
    if (!state.currentUser) return;

    const joinCode = generateJoinCode();

    const { data: group, error: groupError } = await supabase
      .from("groups")
      .insert({
        name: groupName,
        creator_id: state.currentUser.id,
        join_code: joinCode,
        status: "lobby",
      })
      .select()
      .single();

    if (groupError) {
      showToast("Error", "Failed to create group", "error");
      return;
    }

    // Add creator as member
    await supabase.from("group_members").insert({
      group_id: group.id,
      user_id: state.currentUser.id,
    });

    setState((prev) => ({
      ...prev,
      currentGroup: group,
      isCreator: true,
      members: [prev.currentUser!],
      currentPage: "lobby",
    }));
    showToast("Group Created", `Join code: ${joinCode}`);
  };

  const handleJoinGroup = async (joinCode: string) => {
    if (!state.currentUser) return;

    const { data: group, error } = await supabase
      .from("groups")
      .select("*")
      .eq("join_code", joinCode)
      .single();

    if (error || !group) {
      showToast("Error", "Invalid join code", "error");
      return;
    }

    // Add as member
    await supabase.from("group_members").insert({
      group_id: group.id,
      user_id: state.currentUser.id,
    });

    // Load members
    const { data: memberData } = await supabase
      .from("group_members")
      .select("profiles(*)")
      .eq("group_id", group.id);

    const members =
      memberData?.map((m) => (m as any).profiles).filter(Boolean) || [];

    setState((prev) => ({
      ...prev,
      currentGroup: group,
      isCreator: group.creator_id === prev.currentUser?.id,
      members,
      currentPage: "lobby",
    }));
    showToast("Joined Successfully", "Welcome to the group!");
  };

  const handleStartRating = async () => {
    if (!state.currentGroup) return;

    // No need to update group status - each user starts independently
    setState((prev) => ({
      ...prev,
      currentVillaIndex: 0,
      ratings: {},
      hasRatedCurrent: false,
      currentPage: "rating",
    }));
    showToast("Rating Started", "Begin rating villas");
  };

  const handleSaveRating = async (rating: number) => {
    if (!state.currentUser || !state.currentGroup) return;

    const villa = state.villas[state.currentVillaIndex];

    await supabase.from("ratings").upsert({
      group_id: state.currentGroup.id,
      villa_id: villa.id,
      user_id: state.currentUser.id,
      stars: rating,
    });

    setState((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [villa.id]: rating },
      hasRatedCurrent: true,
    }));
    showToast("Rating Saved", `You rated this villa ${rating} stars`);
  };

  const handleNextVilla = () => {
    if (state.currentVillaIndex >= state.villas.length - 1) {
      setState((prev) => ({ ...prev, currentPage: "waiting" }));
      // Don't auto-proceed, let WaitingPage handle it
    } else {
      setState((prev) => ({
        ...prev,
        currentVillaIndex: prev.currentVillaIndex + 1,
        hasRatedCurrent: false,
      }));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showResults = async () => {
    if (!state.currentGroup) return;
    await refreshResults(); // Just call the refresh function
    setState((prev) => ({ ...prev, currentPage: "results" }));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setState({
      currentPage: "login",
      currentUser: null,
      currentGroup: null,
      villas: [],
      currentVillaIndex: 0,
      ratings: {},
      members: [],
      isCreator: false,
      hasRatedCurrent: false,
      selectedVilla: null,
    });
    loadVillas();
  };

  const navigate = (page: Page) => {
    setState((prev) => ({ ...prev, currentPage: page }));
  };

  const refreshResults = async () => {
    if (!state.currentGroup) return;

    try {
      // Reload all members first
      const { data: memberData } = await supabase
        .from("group_members")
        .select("profiles(*)")
        .eq("group_id", state.currentGroup.id);

      const members =
        memberData?.map((m) => (m as any).profiles).filter(Boolean) || [];

      // Get all ratings with profile information
      const { data: ratings } = await supabase
        .from("ratings")
        .select(
          `
        *,
        profiles:user_id (
          id,
          username
        )
      `
        )
        .eq("group_id", state.currentGroup.id);

      // Calculate average ratings and collect individual ratings
      const villaRatings: Record<
        string,
        { ratings: number[]; userRatings: any[] }
      > = {};

      ratings?.forEach((r) => {
        if (!villaRatings[r.villa_id]) {
          villaRatings[r.villa_id] = { ratings: [], userRatings: [] };
        }
        villaRatings[r.villa_id].ratings.push(r.stars);

        // Get the profile data properly
        const profile = (r as any).profiles;
        villaRatings[r.villa_id].userRatings.push({
          userId: r.user_id,
          username: profile?.username || "Unknown",
          rating: r.stars,
        });
      });

      // Load fresh villa data with date ranges
      const { data: freshVillas } = await supabase
        .from("villas")
        .select(
          `
          *,
          villa_date_ranges (*)
        `
        )
        .order("created_at");

      const villasWithRatings = (freshVillas || state.villas).map((villa) => ({
        ...villa,
        avgRating: villaRatings[villa.id]
          ? villaRatings[villa.id].ratings.reduce((a, b) => a + b, 0) /
            villaRatings[villa.id].ratings.length
          : 0,
        userRatings: villaRatings[villa.id]?.userRatings || [],
      }));

      villasWithRatings.sort((a, b) => b.avgRating - a.avgRating);

      setState((prev) => ({
        ...prev,
        villas: villasWithRatings,
        members: members,
      }));

      showToast("Refreshed", "Ratings updated successfully");
    } catch (error) {
      console.error("Error refreshing results:", error);
      showToast("Error", "Failed to refresh ratings", "error");
    }
  };

  return (
    <>
      <Navigation
        onLogout={handleLogout}
        show={state.currentPage !== "login"}
      />
      <div className="container-luxury">
        {state.currentPage === "login" && <LoginPage onLogin={handleLogin} />}
        {state.currentPage === "home" && state.currentUser && (
          <HomePage
            username={state.currentUser.username}
            onNavigate={(page) => navigate(page as Page)}
          />
        )}
        {state.currentPage === "createGroup" && (
          <CreateGroupPage
            onBack={() => navigate("home")}
            onCreate={handleCreateGroup}
          />
        )}
        {state.currentPage === "joinGroup" && (
          <JoinGroupPage
            onBack={() => navigate("home")}
            onJoin={handleJoinGroup}
          />
        )}
        {state.currentPage === "lobby" &&
          state.currentGroup &&
          state.currentUser && (
            <GroupLobbyPage
              groupId={state.currentGroup.id}
              groupName={state.currentGroup.name}
              joinCode={state.currentGroup.join_code}
              members={state.members}
              isCreator={state.isCreator}
              currentUserId={state.currentUser.id}
              onLeave={() => navigate("home")}
              onStart={handleStartRating} // No onAutoStart needed
            />
          )}
        {state.currentPage === "rating" &&
          state.villas[state.currentVillaIndex] && (
            <RatingPage
              villa={state.villas[state.currentVillaIndex]}
              currentIndex={state.currentVillaIndex}
              totalVillas={state.villas.length}
              onSaveRating={handleSaveRating}
              onNext={handleNextVilla}
              hasRated={state.hasRatedCurrent}
              resetKey={state.villas[state.currentVillaIndex].id}
            />
          )}
        {state.currentPage === "waiting" &&
          state.currentGroup &&
          state.currentUser && (
            <WaitingPage
              groupId={state.currentGroup.id}
              totalVillas={state.villas.length}
              totalMembers={state.members.length}
              currentUserId={state.currentUser.id}
              onComplete={showResults}
            />
          )}
        {state.currentPage === "results" && (
          <ResultsPage
            villas={state.villas as any}
            onHome={() => navigate("home")}
            onViewVilla={handleViewVilla}
            onRefresh={refreshResults} // Add this prop
          />
        )}
        {state.currentPage === "villaView" && state.selectedVilla && (
          <VillaViewPage
            villa={state.selectedVilla}
            userRating={state.ratings[state.selectedVilla.id]}
            onBack={() => navigate("results")}
            resetKey={state.villas[state.currentVillaIndex].id}
          />
        )}
        <Toast
          {...toast}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </div>
    </>
  );
}

export default App;
