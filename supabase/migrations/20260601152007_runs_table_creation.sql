create table if not exists runs (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    distance float not null,
    duration int not null,
    tag text
);