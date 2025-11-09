// Module
import { supabaseServer } from './server'
// Types
import { TaskRow } from '@/types/task'
import { ProfileRow } from '@/types/profile'

// タスクに担当者情報 (ProfileRow) をネストした複合型
export type TaskWithAssignee = TaskRow & {
    profiles: ProfileRow | null // assign_id に紐づくプロファイル (NULLの可能性あり)
}

/**
 * 特定のチームに所属するタスク一覧をフェッチする
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/03
 */
export async function fetchTasksByTeam(teamId: string): Promise<TaskWithAssignee[] | null> {
    if (!teamId) {
        return null
    }

    const supabase = await supabaseServer()

    // RLSが有効な場合、ログインユーザーがこのチームに所属している必要があります
    const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(
            `
                id,
                team_id,
                title,
                description,
                status,
                assignee_id,
                created_at,
                due_date,
                profiles!tasks_assignee_id_fkey(
                    id,
                    name,
                    avatar_url
                )
            `
        )
        .eq('team_id', teamId)
        .order('created_at', { ascending: false }) // 新しいタスクを上に表示

    if (error) {
        console.error('Error fetching tasks by team:', error.message)
        return null
    }

    // TaskWithAssignee[] として型キャストして返す
    return tasksData as unknown as TaskWithAssignee[]
}
