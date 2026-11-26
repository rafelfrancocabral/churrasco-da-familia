-- Estado compartilhado do Churrasco da Família (uma única linha).
-- Execute no SQL Editor do Supabase antes de configurar as variáveis no Vercel.

create table if not exists public.churrasco_state (
  id integer primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.churrasco_state to anon;

alter table public.churrasco_state enable row level security;

create policy "Leitura aberta do churrasco"
  on public.churrasco_state for select to anon using (true);

create policy "Escrita aberta do churrasco"
  on public.churrasco_state for insert to anon with check (true);

create policy "Atualização aberta do churrasco"
  on public.churrasco_state for update to anon using (true) with check (true);

-- Habilita Realtime sem duplicar a tabela na publication.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'churrasco_state'
  ) then
    alter publication supabase_realtime add table public.churrasco_state;
  end if;
end $$;
