-- Enable RLS on all tables
alter table profiles enable row level security;
alter table groups enable row level security;
alter table group_members enable row level security;
alter table villas enable row level security;
alter table villa_images enable row level security;
alter table villa_date_options enable row level security;
alter table group_villas enable row level security;
alter table ratings enable row level security;
alter table group_progress enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

-- Groups policies
create policy "Anyone can view groups by join code"
  on groups for select
  using (true);

create policy "Group members can view their groups"
  on groups for select
  using (auth.uid() in (
    select user_id from group_members where group_id = id
  ));

create policy "Users can create groups"
  on groups for insert
  with check (auth.uid() = creator_id);

create policy "Group creator can update group"
  on groups for update
  using (auth.uid() = creator_id);

-- Group members policies
create policy "Anyone can view group members"
  on group_members for select
  using (auth.uid() in (
    select user_id from group_members where group_id = group_members.group_id
  ));

create policy "Users can join groups"
  on group_members for insert
  with check (auth.uid() = user_id);

-- Villas policies (public read)
create policy "Anyone can view villas"
  on villas for select
  using (true);

-- Villa images policies (public read)
create policy "Anyone can view villa images"
  on villa_images for select
  using (true);

-- Villa date options policies (public read)
create policy "Anyone can view villa date options"
  on villa_date_options for select
  using (true);

-- Group villas policies
create policy "Group members can view group villas"
  on group_villas for select
  using (auth.uid() in (
    select user_id from group_members where group_id = group_villas.group_id
  ));

create policy "Group creator can manage group villas"
  on group_villas for all
  using (auth.uid() in (
    select creator_id from groups where id = group_id
  ));

-- Ratings policies
create policy "Group members can view ratings"
  on ratings for select
  using (auth.uid() in (
    select user_id from group_members where group_id = ratings.group_id
  ));

create policy "Users can insert own ratings"
  on ratings for insert
  with check (auth.uid() = user_id and auth.uid() in (
    select user_id from group_members where group_id = ratings.group_id
  ));

create policy "Users can update own ratings"
  on ratings for update
  using (auth.uid() = user_id);

-- Group progress policies
create policy "Group members can view progress"
  on group_progress for select
  using (auth.uid() in (
    select user_id from group_members gm where gm.group_id = group_progress.group_id
  ));

create policy "Group creator can manage progress"
  on group_progress for all
  using (auth.uid() in (
    select creator_id from groups where id = group_id
  ));