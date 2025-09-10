-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create groups table  
create table if not exists public.groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  creator_id uuid not null references public.profiles(id) on delete cascade,
  join_code text not null unique,
  status text not null default 'lobby' check (status in ('lobby', 'rating', 'finished')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create group_members table
create table if not exists public.group_members (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(group_id, user_id)
);

-- Create villas table (MODIFIED: removed price, start_date, end_date)
create table if not exists public.villas (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  country text not null,
  city text not null,
  address text,
  link text not null,
  images text[] default array[]::text[],
  additional_information text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create villa_date_ranges table (NEW: for multiple date ranges with prices)
create table if not exists public.villa_date_ranges (
  id uuid primary key default uuid_generate_v4(),
  villa_id uuid not null references public.villas(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  price_min integer not null,
  price_max integer, -- nullable, when null means single price (price_min)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_date_range check (end_date > start_date),
  constraint valid_price_range check (price_max is null or price_max >= price_min)
);

-- Create ratings table
create table if not exists public.ratings (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references public.groups(id) on delete cascade,
  villa_id uuid not null references public.villas(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  stars numeric(2,1) not null check (stars >= 0 and stars <= 5),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(group_id, villa_id, user_id)
);

-- Create indexes
create index idx_groups_join_code on public.groups(join_code);
create index idx_group_members_group_id on public.group_members(group_id);
create index idx_ratings_group_villa on public.ratings(group_id, villa_id);
create index idx_villa_date_ranges_villa_id on public.villa_date_ranges(villa_id);
create index idx_villa_date_ranges_dates on public.villa_date_ranges(start_date, end_date);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.villas enable row level security;
alter table public.villa_date_ranges enable row level security;
alter table public.ratings enable row level security;

-- RLS Policies
-- Profiles policies
create policy "Users can view all profiles" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = user_id);

-- Groups policies  
create policy "Anyone can view groups" on public.groups
  for select using (true);

create policy "Users can create groups" on public.groups
  for insert with check (true);

-- Group members policies
create policy "Anyone can view group members" on public.group_members
  for select using (true);

create policy "Users can join groups" on public.group_members
  for insert with check (true);

-- Villas policies
create policy "Anyone can view villas" on public.villas
  for select using (true);

-- Villa date ranges policies
create policy "Anyone can view villa date ranges" on public.villa_date_ranges
  for select using (true);

-- Ratings policies
create policy "Group members can view ratings" on public.ratings
  for select using (true);

create policy "Users can create ratings" on public.ratings
  for insert with check (true);