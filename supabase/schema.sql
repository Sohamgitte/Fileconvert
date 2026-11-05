create table if not exists public.conversions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_name text not null,
  source_path text not null,
  output_format text not null,
  output_path text,
  status text not null default 'queued' check (status in ('queued','processing','completed','failed')),
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.conversions enable row level security;
create policy "users read own conversions" on public.conversions for select using (auth.uid() = user_id);
create policy "users create own conversions" on public.conversions for insert with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public) values ('conversion-files', 'conversion-files', false)
on conflict (id) do nothing;
