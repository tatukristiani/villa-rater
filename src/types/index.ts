export interface User {
  id: string;
  username: string;
  display_id: string;
}

export interface Group {
  id: string;
  name: string;
  creator_id: string;
  join_code: string;
  created_at: string;
  status: "lobby" | "rating" | "finished";
}

export interface GroupMember {
  group_id: string;
  user_id: string;
  username?: string;
  joined_at: string;
}

export interface Villa {
  id: string;
  title: string;
  country: string;
  city: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  smoking_allowed: boolean;
  nearby?: string;
  amenities: string[];
  description?: string;
}

export interface VillaImage {
  id: string;
  villa_id: string;
  url: string;
  alt?: string;
}

export interface VillaDateOption {
  id: string;
  villa_id: string;
  start_date: string;
  end_date: string;
  price_cents: number;
}

export interface GroupVilla {
  group_id: string;
  villa_id: string;
  position: number;
  villa?: Villa;
  images?: VillaImage[];
  date_options?: VillaDateOption[];
}

export interface Rating {
  group_id: string;
  villa_id: string;
  user_id: string;
  date_option_id?: string;
  stars: number;
  comment?: string;
  created_at: string;
}

export interface GroupProgress {
  group_id: string;
  current_index: number;
}

export interface VillaFilters {
  countries: string[];
  cities: string[];
  max_price?: number;
  smoking_allowed?: boolean;
  date_range_start?: string;
  date_range_end?: string;
}
