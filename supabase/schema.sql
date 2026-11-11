-- Chuyển Xanh: bảng lưu câu hỏi người dân (ẩn danh)
-- Chạy một lần trong Supabase: SQL Editor → New query → dán toàn bộ → Run

create table if not exists public.questions (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  text        text not null check (char_length(text) between 2 and 500),
  lang        text not null default 'vi' check (lang in ('vi', 'en')),
  topic       text not null default 'other',   -- id đoạn kiến thức khớp nhất trong data/knowledge.json
  source      text not null check (source in ('chat', 'form')),
  answered    boolean not null default false   -- trợ lý có trả lời được không
);

create index if not exists questions_created_at_idx on public.questions (created_at desc);
create index if not exists questions_topic_idx on public.questions (topic);

-- Bật RLS và KHÔNG tạo policy nào: trình duyệt không đọc/ghi trực tiếp được.
-- Chỉ máy chủ Next.js (dùng secret key) mới ghi và đọc.
alter table public.questions enable row level security;

-- Gợi ý cho người quản trị: câu hỏi trợ lý chưa trả lời được, để bổ sung vào kho
create or replace view public.unanswered_questions with (security_invoker = true) as
  select created_at, lang, text, topic
  from public.questions
  where answered = false
  order by created_at desc;
