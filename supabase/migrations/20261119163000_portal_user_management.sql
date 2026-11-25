create table if not exists public.portal_user_profiles (
    user_id uuid primary key references auth.users (id) on delete cascade,
    full_name text not null,
    level smallint not null default 1 check (level between 1 and 8),
    group_name text not null default '',
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.portal_time_entries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    clock_in timestamptz not null default now(),
    clock_out timestamptz,
    created_by uuid references auth.users (id) on delete set null,
    created_at timestamptz not null default now(),
    constraint portal_time_entries_valid_range
        check (clock_out is null or clock_out >= clock_in)
);

create unique index if not exists portal_time_entries_one_open_entry_per_user
    on public.portal_time_entries (user_id)
    where clock_out is null;

create index if not exists portal_time_entries_user_clock_in_idx
    on public.portal_time_entries (user_id, clock_in desc);

create or replace view public.portal_user_time_stats
with (security_invoker = true)
as
select
    user_id,
    count(*)::integer as time_entry_count,
    coalesce(
        sum(extract(epoch from (coalesce(clock_out, now()) - clock_in)))::bigint,
        0
    ) as total_seconds,
    count(*) filter (where clock_out is null)::integer as open_entries
from public.portal_time_entries
group by user_id;

alter table public.portal_user_profiles enable row level security;
alter table public.portal_time_entries enable row level security;

revoke all on table public.portal_user_profiles from anon, authenticated;
revoke all on table public.portal_time_entries from anon, authenticated;
revoke all on table public.portal_user_time_stats from anon, authenticated;

grant select, insert, update, delete on table public.portal_user_profiles to service_role;
grant select, insert, update, delete on table public.portal_time_entries to service_role;
grant select on table public.portal_user_time_stats to service_role;
