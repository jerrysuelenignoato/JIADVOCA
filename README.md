# JIADVOCA

Plataforma SaaS de geração de conteúdo para Instagram voltada a advogados previdenciaristas brasileiros.

**Stack:** Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Groq · Mercado Pago · Vercel

---

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

---

## Variáveis de ambiente

Renomeie `.env.local` e preencha todos os valores:

| Variável | Onde encontrar |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → Data API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → Data API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → Data API → service_role |
| `GROQ_API_KEY` | console.groq.com → API Keys |
| `MP_ACCESS_TOKEN` | mercadopago.com.br/developers → sua app → Credenciais |
| `MP_PUBLIC_KEY` | mesma página do Access Token |
| `MP_PREAPPROVAL_MENSAL` | ID do plano de assinatura mensal criado no MP |
| `MP_WEBHOOK_SECRET` | MP → sua app → Webhooks → gerar segredo |
| `APP_URL` | URL pública do deploy (ex: `https://jiadvoca.com.br`) |

---

## Deploy no Vercel — passo a passo

### 1. Criar repositório no GitHub

```bash
git init
git add .
git commit -m "chore: initial commit"
git remote add origin https://github.com/SEU_USUARIO/jiadvoca.git
git push -u origin main
```

### 2. Importar no Vercel

1. Acesse `vercel.com/new`
2. Clique em **Import Git Repository** → selecione `jiadvoca`
3. Framework: **Next.js** (detectado automaticamente)
4. Clique em **Environment Variables** e adicione **todas** as variáveis do `.env.local`
5. Clique em **Deploy**

### 3. Configurar domínio (opcional)

- Vercel → seu projeto → **Domains** → adicionar domínio próprio
- Atualizar `APP_URL` nas env vars do Vercel para o domínio final

### 4. Configurar webhook do Mercado Pago

1. `mercadopago.com.br/developers` → sua aplicação → **Webhooks**
2. Adicionar URL: `https://SEU_DOMINIO/api/webhook/mp`
3. Eventos: marcar `payment` e `subscription_preapproval`
4. Copiar o **Secret** gerado → colar em `MP_WEBHOOK_SECRET` nas env vars do Vercel
5. Fazer **redeploy** para aplicar a nova variável

### 5. Configurar Auth no Supabase

1. Supabase → **Authentication** → **URL Configuration**
2. **Site URL**: `https://SEU_DOMINIO`
3. **Redirect URLs**: adicionar `https://SEU_DOMINIO/auth/callback`
4. Para Google OAuth: **Authentication** → **Providers** → Google → habilitar e configurar OAuth credentials

---

## Banco de dados

Rodar o SQL abaixo no **SQL Editor** do Supabase (uma vez):

```sql
-- profiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  nome text not null,
  email text not null unique,
  oab text, estado_oab text,
  area_atuacao text default 'previdenciario',
  whatsapp text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- subscriptions
create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plano text not null check (plano in ('trial','mensal','anual')),
  status text not null check (status in ('ativa','cancelada','expirada','pendente')),
  inicio timestamptz default now(),
  fim timestamptz,
  mp_payment_id text,
  created_at timestamptz default now()
);

-- contents
create table public.contents (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tipo text not null check (tipo in ('carrossel','reel','legenda')),
  area text not null, tom text not null,
  headline text, tese text,
  conteudo jsonb not null,
  legenda text, hashtags text[],
  status text not null default 'ideia' check (status in ('ideia','revisando','agendado','publicado')),
  data_agendada timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- usage
create table public.usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  mes text not null,
  carrosseis_gerados int default 0,
  reels_gerados int default 0,
  unique(user_id, mes)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.contents enable row level security;
alter table public.usage enable row level security;

create policy "users_own_profile" on public.profiles for all using (auth.uid() = id);
create policy "users_own_subs" on public.subscriptions for all using (auth.uid() = user_id);
create policy "users_own_contents" on public.contents for all using (auth.uid() = user_id);
create policy "users_own_usage" on public.usage for all using (auth.uid() = user_id);

-- trigger: cria profile + trial ao cadastrar
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, email)
  values (new.id, new.raw_user_meta_data->>'nome', new.email);
  insert into public.subscriptions (user_id, plano, status, fim)
  values (new.id, 'trial', 'ativa', now() + interval '7 days');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
