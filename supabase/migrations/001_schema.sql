-- AVIS Casorate Primo — schema, Row Level Security, storage.
-- Esegui nel SQL Editor di Supabase (oppure con `supabase db push`).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- admin
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

-- Un utente può solo verificare di essere admin. Gli admin si aggiungono da SQL Editor:
--   insert into public.admins (user_id) select id from auth.users where email = 'tua@email.it';
drop policy if exists "admins_self_select" on public.admins;
create policy "admins_self_select" on public.admins for select using (user_id = auth.uid());

-- ---------------------------------------------------------------- eventi
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  description text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  location text,
  poster_url text,
  gallery jsonb not null default '[]'::jsonb,
  external_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
drop policy if exists "events_public_read" on public.events;
create policy "events_public_read" on public.events for select using (status = 'published');
drop policy if exists "events_admin_all" on public.events;
create policy "events_admin_all" on public.events for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- news
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  body text not null default '',
  image_url text,
  attachments jsonb not null default '[]'::jsonb,   -- [{ "name": "...", "url": "..." }]
  external_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  publish_at timestamptz,                            -- pubblicazione programmata
  created_at timestamptz not null default now()
);
alter table public.news enable row level security;
drop policy if exists "news_public_read" on public.news;
create policy "news_public_read" on public.news for select
  using (status = 'published' and (publish_at is null or publish_at <= now()));
drop policy if exists "news_admin_all" on public.news;
create policy "news_admin_all" on public.news for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- foto
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in
    ('eventi', 'manifestazioni', 'coro', 'scuola', 'attivita', 'storici')),
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums (id) on delete cascade,
  url text not null,
  caption text,
  created_at timestamptz not null default now()
);
alter table public.albums enable row level security;
alter table public.photos enable row level security;
drop policy if exists "albums_public_read" on public.albums;
create policy "albums_public_read" on public.albums for select using (true);
drop policy if exists "albums_admin_all" on public.albums;
create policy "albums_admin_all" on public.albums for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "photos_public_read" on public.photos;
create policy "photos_public_read" on public.photos for select using (true);
drop policy if exists "photos_admin_all" on public.photos;
create policy "photos_admin_all" on public.photos for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- documenti
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in
    ('statuto', 'atto', 'bilanci', 'attestazioni', 'riconoscimenti', 'altri')),
  url text not null,
  doc_date date,
  is_published boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);
alter table public.documents enable row level security;
drop policy if exists "documents_public_read" on public.documents;
create policy "documents_public_read" on public.documents for select using (is_published);
drop policy if exists "documents_admin_all" on public.documents;
create policy "documents_admin_all" on public.documents for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- direttivo
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role text not null default '',
  group_name text not null default 'consigliere' check (group_name in ('direttivo', 'consigliere', 'collaboratore')),
  bio text,
  photo_url text,
  sort int not null default 0
);
alter table public.team_members enable row level security;
drop policy if exists "team_public_read" on public.team_members;
create policy "team_public_read" on public.team_members for select using (true);
drop policy if exists "team_admin_all" on public.team_members;
create policy "team_admin_all" on public.team_members for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- impostazioni e testi
create table if not exists public.site_settings (
  key text primary key,            -- contacts | socials | home | logo
  value jsonb not null default '{}'::jsonb
);
create table if not exists public.pages (
  slug text primary key,           -- chi-siamo, coro, progetto-scuola, torneo, come-donare, privacy, cookie
  title text not null,
  body text not null default '',   -- paragrafi separati da una riga vuota
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
drop policy if exists "settings_public_read" on public.site_settings;
create policy "settings_public_read" on public.site_settings for select using (true);
drop policy if exists "settings_admin_all" on public.site_settings;
create policy "settings_admin_all" on public.site_settings for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "pages_public_read" on public.pages;
create policy "pages_public_read" on public.pages for select using (true);
drop policy if exists "pages_admin_all" on public.pages;
create policy "pages_admin_all" on public.pages for all using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------- messaggi dal modulo contatti
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200),
  message text not null check (char_length(message) between 1 and 4000),
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
-- chiunque può inviare un messaggio, nessuno (tranne gli admin) può leggerli
drop policy if exists "messages_public_insert" on public.contact_messages;
create policy "messages_public_insert" on public.contact_messages for insert with check (true);
drop policy if exists "messages_admin_read" on public.contact_messages;
create policy "messages_admin_read" on public.contact_messages for select using (public.is_admin());
drop policy if exists "messages_admin_delete" on public.contact_messages;
create policy "messages_admin_delete" on public.contact_messages for delete using (public.is_admin());

-- ---------------------------------------------------------------- storage (locandine, foto, PDF)
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media_admin_insert" on storage.objects;
create policy "media_admin_insert" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_update" on storage.objects;
create policy "media_admin_update" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media_admin_delete" on storage.objects;
create policy "media_admin_delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());
