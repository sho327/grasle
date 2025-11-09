-- =========================================
-- 🚨 データベース初期化 (全てを削除)
-- ⚠️ 既存のデータは全て失われます
-- =========================================

-- RLSポリシーの削除
DROP POLICY IF EXISTS "profiles: select_self" ON profiles;
DROP POLICY IF EXISTS "profiles: update_self" ON profiles;
DROP POLICY IF EXISTS "teams: select_member_teams" ON teams;
DROP POLICY IF EXISTS "teams: delete_non_personal" ON teams;
DROP POLICY IF EXISTS "memberships: select_self" ON memberships;
DROP POLICY IF EXISTS "memberships: insert_self" ON memberships;
DROP POLICY IF EXISTS "tasks: select_in_member_teams" ON tasks;
DROP POLICY IF EXISTS "tasks: insert_in_member_teams" ON tasks;
DROP POLICY IF EXISTS "tasks: update_in_member_teams" ON tasks;
DROP POLICY IF EXISTS "work_logs: select_in_member_teams" ON work_logs;
DROP POLICY IF EXISTS "work_logs: insert_in_member_teams" ON work_logs;
DROP POLICY IF EXISTS "reports: select_in_member_teams" ON reports;
DROP POLICY IF EXISTS "reports: insert_self" ON reports;
DROP POLICY IF EXISTS "reports: update_self" ON reports;
DROP POLICY IF EXISTS "notifications: select_self" ON notifications;
-- Storageポリシーの削除は、GUIでの管理を推奨するため除外します
DROP POLICY IF EXISTS "storage: avatars_manage_self" ON storage.objects; 

-- Authトリガーの削除
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- トリガー関数の削除
DROP TRIGGER IF EXISTS trg_prevent_personal_team_deletion ON public.teams;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.prevent_personal_team_deletion();

-- インデックスの削除（テーブル削除時に自動削除されるため省略可能だが、明示的に記述）
DROP INDEX IF EXISTS idx_tasks_team;
DROP INDEX IF EXISTS idx_tasks_assignee;
DROP INDEX IF EXISTS idx_reports_team;
DROP INDEX IF EXISTS idx_reports_user;
DROP INDEX IF EXISTS idx_worklogs_task;
DROP INDEX IF EXISTS idx_worklogs_user;
DROP INDEX IF EXISTS idx_notifications_user;
DROP INDEX IF EXISTS idx_notifications_team;
DROP INDEX IF EXISTS unique_personal_team_per_owner;

-- テーブルの削除 (外部キー制約の関係で順番に削除)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS work_logs CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
