-- ══════════════════════════════════════════════════════════
-- ThaiSkill — Supabase Setup
-- วิธีใช้: Supabase Dashboard → SQL Editor → New query
--          วางโค้ดนี้ทั้งหมด → กด Run (Ctrl+Enter)
-- ══════════════════════════════════════════════════════════

-- ── 1. ตาราง Contact Messages ─────────────────────────────
create table if not exists contact_messages (
  id         bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name       text not null,
  email      text not null,
  message    text not null
);

-- ── 2. ตาราง Comments (แสดงบนหน้าเว็บ) ─────────────────────
create table if not exists comments (
  id         bigint generated always as identity primary key,
  created_at timestamptz default now(),
  name       text not null,
  message    text not null
);

-- ── 3. Row Level Security ──────────────────────────────────
alter table contact_messages enable row level security;
alter table comments         enable row level security;

-- ── 4. Policies: ทุกคนส่งข้อมูลได้ (form submission) ────────
create policy "allow_insert_contact"
  on contact_messages for insert to anon
  with check (true);

create policy "allow_insert_comment"
  on comments for insert to anon
  with check (true);

-- ── 5. Policy: ทุกคนอ่าน comments ได้ (แสดงบนเว็บ) ─────────
create policy "allow_read_comments"
  on comments for select to anon
  using (true);

-- ══════════════════════════════════════════════════════════
-- หลัง Run เสร็จแล้ว ไปที่:
-- Settings → API → คัดลอก Project URL และ anon public key
-- นำไปใส่ใน Vercel → Settings → Environment Variables:
--   SUPABASE_URL      = https://xxxxxxxxxxxx.supabase.co
--   SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp...
-- ══════════════════════════════════════════════════════════
