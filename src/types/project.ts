import { Database } from './Database'

/**
 * Projects テーブルの単一行のデータ型
 * - チーム一覧画面や、SelectedTeam の基底型として利用
 */
export type ProjectRow = Database['public']['Tables']['projects']['Row']
