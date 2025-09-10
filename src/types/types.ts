export interface Profile {
  id: string;
  user_id: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  creator_id: string;
  join_code: string;
  status: "lobby" | "rating" | "finished";
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  joined_at: string;
}

export interface VillaDateRange {
  id: string;
  villa_id: string;
  start_date: string;
  end_date: string;
  price_min: number;
  price_max: number | null;
  created_at: string;
}

export interface Villa {
  id: string;
  title: string;
  country: string;
  city: string;
  address: string | null;
  link: string;
  images: string[];
  additional_information: string | null;
  created_at: string;
  villa_date_ranges?: VillaDateRange[];
}

export interface Rating {
  id: string;
  group_id: string;
  villa_id: string;
  user_id: string;
  stars: number;
  created_at: string;
}
