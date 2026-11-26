-- Estado compartilhado do Churrasco da Família (uma única linha).
-- Execute no SQL Editor do Supabase antes de configurar as variáveis no Vercel.
-- Pode ser executado mais de uma vez sem duplicar políticas.

create table if not exists public.churrasco_state (
  id integer primary key default 1,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.churrasco_state to anon;

alter table public.churrasco_state enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'churrasco_state'
      and policyname = 'Leitura aberta do churrasco'
  ) then
    create policy "Leitura aberta do churrasco"
      on public.churrasco_state for select to anon using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'churrasco_state'
      and policyname = 'Escrita aberta do churrasco'
  ) then
    create policy "Escrita aberta do churrasco"
      on public.churrasco_state for insert to anon with check (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'churrasco_state'
      and policyname = 'Atualização aberta do churrasco'
  ) then
    create policy "Atualização aberta do churrasco"
      on public.churrasco_state for update to anon using (true) with check (true);
  end if;
end $$;

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
