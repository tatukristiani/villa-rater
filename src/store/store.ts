import { create } from "zustand";
import { supabase, signInAnonymously, createProfile } from "../lib/supabase";
import type { User, Group, GroupMember, Rating } from "../types";

interface Store {
  user: User | null;
  currentGroup: Group | null;
  members: GroupMember[];
  initAuth: () => Promise<void>;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
  setCurrentGroup: (group: Group) => void;
  setMembers: (members: GroupMember[]) => void;
  updateUsername: (username: string) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  currentGroup: null,
  members: [],

  initAuth: async () => {
    try {
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
          set({
            user: {
              id: session.user.id,
              username: profile.username,
              display_id: profile.display_id,
            },
          });
        }
      }

      // Check localStorage for saved session
      const savedUsername = localStorage.getItem("username");
      if (savedUsername && !session) {
        await get().login(savedUsername);
      }
    } catch (error) {
      console.error("Auth init error:", error);
    }
  },

  login: async (username: string) => {
    try {
      const { user, session } = await signInAnonymously();
      if (!user) throw new Error("Failed to create anonymous session");

      const profile = await createProfile(user.id, username);

      const newUser = {
        id: user.id,
        username: profile.username,
        display_id: profile.display_id,
      };

      localStorage.setItem("username", username);
      set({ user: newUser });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("username");
    set({ user: null, currentGroup: null, members: [] });
  },

  setCurrentGroup: (group: Group) => {
    set({ currentGroup: group });
  },

  setMembers: (members: GroupMember[]) => {
    set({ members });
  },

  updateUsername: async (username: string) => {
    const { user } = get();
    if (!user) return;

    await supabase.from("profiles").update({ username }).eq("user_id", user.id);

    localStorage.setItem("username", username);
    set({ user: { ...user, username } });
  },
}));
