# Supabase Setup Guide

To get this Bookmark Manager working, follow these steps:

## 1. Create a Supabase Project
Go to [supabase.com](https://supabase.com) and create a new project.

## 2. Setup Database Table
Run the following SQL in the Supabase SQL Editor:

```sql
-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  url text not null,
  title text not null,
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own bookmarks"
  on bookmarks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using ( auth.uid() = user_id );

-- Enable Real-time
alter publication supabase_realtime add table bookmarks;
```

## 3. Enable Google Auth
1. Go to **Authentication** -> **Providers** -> **Google**.
2. Enable it and follow the instructions to set up Google Cloud Console credentials.
3. Add `http://localhost:3000/auth/callback` to your Google Cloud Console OAuth redirect URIs.

## 4. Environment Variables
Create a `.env.local` file in the root of this project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
