-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  display_id text unique not null,
  created_at timestamptz default now()
);

-- Groups table
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  creator_id uuid not null references auth.users(id) on delete cascade,
  join_code text not null unique,
  created_at timestamptz default now(),
  status text not null default 'lobby' check (status in ('lobby', 'rating', 'finished'))
);

-- Group members
create table if not exists group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  joined_at timestamptz default now(),
  primary key (group_id, user_id)
);

-- Villas master table
create table if not exists villas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  country text not null,
  city text not null,
  address text,
  latitude double precision,
  longitude double precision,
  smoking_allowed boolean default false,
  nearby text,
  amenities jsonb default '[]'::jsonb,
  description text
);

-- Villa images
create table if not exists villa_images (
  id uuid primary key default gen_random_uuid(),
  villa_id uuid not null references villas(id) on delete cascade,
  url text not null,
  alt text
);

-- Villa date options
create table if not exists villa_date_options (
  id uuid primary key default gen_random_uuid(),
  villa_id uuid not null references villas(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  price_cents integer not null check (price_cents >= 0)
);

-- Group villas
create table if not exists group_villas (
  group_id uuid not null references groups(id) on delete cascade,
  villa_id uuid not null references villas(id) on delete cascade,
  position integer not null,
  primary key (group_id, villa_id)
);

-- Ratings
create table if not exists ratings (
  group_id uuid not null references groups(id) on delete cascade,
  villa_id uuid not null references villas(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date_option_id uuid references villa_date_options(id),
  stars numeric(2,1) not null check (stars >= 0 and stars <= 5),
  comment text,
  created_at timestamptz default now(),
  primary key (group_id, villa_id, user_id)
);

-- Group progress
create table if not exists group_progress (
  group_id uuid primary key references groups(id) on delete cascade,
  current_index integer not null default 0
);

-- Indexes
create index idx_ratings_group_villa on ratings (group_id, villa_id);
create index idx_villa_date_options_villa on villa_date_options (villa_id);
create index idx_villa_images_villa on villa_images (villa_id);
create index idx_group_members_group on group_members (group_id);
create index idx_group_villas_group on group_villas (group_id);