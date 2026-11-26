# 🔥 Churrasco da Família

PWA mobile-first para organizar o churrasco. Layout e efeitos visuais portados de
`Churrasco.html` (referência visual exata).

## Etapas concluídas

### Etapa 1 — Scaffold + layout estático
- Vite + React + TypeScript + Tailwind CSS 4
- Layout das 3 abas (Início, Tarefas, Escalação) com dados de seed
- CSS puro: glassmorphism, botões físicos, brilhos de brasa, tilt 3D por ponteiro,
  cartas douradas (confirmadas) e prateadas (pendentes), holográfico, raios, brilho
  e abertura de pacote. Variantes ICON/RARE por nota ficam suspensas a pedido.
- Logo em `public/logo.png` (PNG com fundo transparente, gerado a partir do `logo.jpeg`)
- `viewport-fit=cover`, safe areas, alvos de toque ≥ 44px, `prefers-reduced-motion`
- Texto do usuário renderizado via React (escape automático de HTML)

### Etapa 2 — Estado global e persistência
- Zustand + middleware `persist` (localStorage, chave `churrasco-da-familia-v1`)
- Migração automática dos dados da versão HTML antiga (`churrasco-v2`)
- Contagem regressiva real (dias/horas/min/seg) e data editável no hero
- Convidados adicionados/editados no Elenco refletem em Início e Tarefas e sobrevivem ao reload

### Etapa 3 — CRUD, filtros e desfazer
- Tarefas: criar, editar, excluir, concluir/reabrir, filtros por status e responsável
- Limpar tarefas: remover concluídas, desmarcar todas, apagar todas
- Toast com **Desfazer** por 4,5s (snapshot do estado antes da ação destrutiva)
- Convidados: criar, editar, excluir e tocar na carta para confirmar/tirar presença
- Bottom sheets com validação, seleção de responsáveis e criação de pessoa dentro da tarefa
- Teclado mobile: sheet limitado à área visível e campo focado sempre trazido para dentro da tela
- Seletor de emojis ampliado (🍺 🇯🇵 ⚽ 🥸 🍖 🥩 🧑‍⚕️)
- Número da camisa no topo do card (substituiu nota/posição) e editável no sheet
- Brilho retangular do anel de progresso removido (mantido o tilt 3D)

### Extra a pedido
- Barra com `＋ Novo convidado` e `✎ Editar` no Elenco, com bottom sheet funcional
- Logo com fundo transparente e subtítulo “Deus, Pátria, Família, Brasil”

Ainda não implementado (Etapas 4–5): raridades FIFA completas, PWA/deploy/Supabase.

## Comandos

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```
