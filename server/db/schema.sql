create schema if not exists wizbits;

create extension if not exists pgcrypto;

create table if not exists wizbits.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  friend_code text unique not null,
  avatar text not null,
  created_at timestamptz not null default now()
);

create table if not exists wizbits.profiles (
  user_id uuid primary key references wizbits.users(id) on delete cascade,
  xp integer not null default 0,
  wiz_bucks integer not null default 80,
  battle_points integer not null default 0,
  pet_seeds integer not null default 0,
  hearts integer not null default 3,
  owned_mascots jsonb not null default '["classic"]',
  equipped_mascot text not null default 'classic',
  owned_pets jsonb not null default '[]',
  active_pet_by_element jsonb not null default '{}',
  pet_stats jsonb not null default '{}',
  adventure_progress jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists wizbits.friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references wizbits.users(id) on delete cascade,
  friend_user_id uuid not null references wizbits.users(id) on delete cascade,
  status text not null default 'accepted',
  created_at timestamptz not null default now(),
  unique (user_id, friend_user_id)
);

create table if not exists wizbits.battle_requests (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references wizbits.users(id) on delete cascade,
  to_user_id uuid not null references wizbits.users(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists wizbits.sessions (
  sid varchar not null primary key,
  sess json not null,
  expire timestamp(6) not null
);

create index if not exists sessions_expire_idx on wizbits.sessions (expire);
