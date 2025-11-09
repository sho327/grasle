import { Database } from './Database'

/**
 * Teams テーブルの単一行のデータ型
 * - チーム一覧画面や、SelectedTeam の基底型として利用
 */
export type TeamRow = Database['public']['Tables']['teams']['Row']

/**
 * ユーザーが現在選択しているチームの型 (TeamRowと同じ構造)
 */
export type SelectedTeam = TeamRow

// 他にも Team のフォームで使う型など、汎用的な型をここに追加できます
