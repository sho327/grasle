export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string | null // name は NULL 許容ではないが、TS の利便性を考慮して一旦 string に
                    avatar_url: string | null
                    theme: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    avatar_url?: string | null
                    theme?: string | null
                    created_at?: string | null
                }
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>
                Relationships: []
            }

            teams: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    owner_id: string | null
                    is_personal: boolean
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    owner_id?: string | null
                    is_personal?: boolean
                    created_at?: string | null
                }
                Update: Partial<Database['public']['Tables']['teams']['Insert']>
                Relationships: [
                    {
                        foreignKeyName: 'teams_owner_id_fkey'
                        columns: ['owner_id']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                ]
            }

            memberships: {
                Row: {
                    id: string
                    user_id: string
                    team_id: string
                    role: 'admin' | 'member' | 'guest'
                    status: 'active' | 'invited' | 'removed'
                    invited_by: string | null
                    joined_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    team_id: string
                    role: 'admin' | 'member' | 'guest'
                    status: 'active' | 'invited' | 'removed'
                    invited_by?: string | null
                    joined_at?: string | null
                }
                Update: Partial<Database['public']['Tables']['memberships']['Insert']>
                Relationships: [
                    {
                        foreignKeyName: 'memberships_user_id_fkey'
                        columns: ['user_id']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'memberships_team_id_fkey'
                        columns: ['team_id']
                        referencedRelation: 'teams'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'memberships_invited_by_fkey'
                        columns: ['invited_by']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                ]
            }

            // 🆕 🚀 projects テーブル
            projects: {
                Row: {
                    id: string
                    team_id: string
                    name: string
                    description: string | null
                    status: 'active' | 'on_hold' | 'completed' | 'archived'
                    start_date: string | null // SQLでは DATE
                    end_date: string | null // SQLでは DATE
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    team_id: string
                    name: string
                    description?: string | null
                    status?: 'active' | 'on_hold' | 'completed' | 'archived'
                    start_date?: string | null
                    end_date?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: Partial<Database['public']['Tables']['projects']['Insert']>
                Relationships: [
                    {
                        foreignKeyName: 'projects_team_id_fkey'
                        columns: ['team_id']
                        referencedRelation: 'teams'
                        referencedColumns: ['id']
                    },
                ]
            }

            // 🚀 tasks テーブル (🔄 project_id に変更, status に 'canceled' を追加)
            tasks: {
                Row: {
                    id: string
                    project_id: string // 🔄 team_id から変更
                    title: string
                    description: string | null
                    assignee_id: string | null
                    status: 'todo' | 'in_progress' | 'done' | 'canceled' // 🔄 'canceled' を追加
                    due_date: string | null
                    start_at: string | null
                    end_at: string | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    project_id: string // 🔄 team_id から変更
                    title: string
                    description?: string | null
                    assignee_id?: string | null
                    status?: 'todo' | 'in_progress' | 'done' | 'canceled' // 🔄 'canceled' を追加
                    due_date?: string | null
                    start_at?: string | null
                    end_at?: string | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: Partial<Database['public']['Tables']['tasks']['Insert']>
                Relationships: [
                    {
                        foreignKeyName: 'tasks_project_id_fkey' // 🔄 FK名も project_id に合わせることを推奨
                        columns: ['project_id']
                        referencedRelation: 'projects'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'tasks_assignee_id_fkey'
                        columns: ['assignee_id']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                ]
            }

            // 🚀 work_logs テーブル (変更なし)
            work_logs: {
                Row: {
                    id: string
                    task_id: string
                    user_id: string
                    start_time: string
                    end_time: string | null
                    duration_minutes: number | null // GENERATED ALWAYS AS
                    memo: string | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    task_id: string
                    user_id: string
                    start_time: string
                    end_time?: string | null
                    memo?: string | null
                    created_at?: string | null
                }
                Update: Partial<Database['public']['Tables']['work_logs']['Insert']>
                Relationships: [
                    {
                        foreignKeyName: 'work_logs_task_id_fkey'
                        columns: ['task_id']
                        referencedRelation: 'tasks'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'work_logs_user_id_fkey'
                        columns: ['user_id']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                ]
            }

            // 🚀 reports テーブル (🔄 project_id を追加)
            reports: {
                Row: {
                    id: string
                    team_id: string
                    project_id: string | null // 🔄 project_id を追加 (NULL許容)
                    user_id: string
                    date: string
                    content: string
                    generated_from_task_ids: string[] | null // SQLではUUID[] DEFAULT '{}'だが、TSではstring[]またはstring[] | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    team_id: string
                    project_id?: string | null // 🔄 project_id を追加
                    user_id: string
                    date: string
                    content: string
                    generated_from_task_ids?: string[] | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: Partial<Database['public']['Tables']['reports']['Insert']>
                Relationships: [
                    {
                        foreignKeyName: 'reports_user_id_fkey'
                        columns: ['user_id']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'reports_team_id_fkey'
                        columns: ['team_id']
                        referencedRelation: 'teams'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'reports_project_id_fkey' // 🆕 project_id のリレーションシップを追加
                        columns: ['project_id']
                        referencedRelation: 'projects'
                        referencedColumns: ['id']
                    },
                ]
            }

            // 🚀 notifications テーブル (🔄 project_id を追加)
            notifications: {
                Row: {
                    id: string
                    team_id: string | null
                    project_id: string | null // 🔄 project_id を追加
                    user_id: string
                    sender_id: string | null
                    type: 'task' | 'report' | 'system' | 'comment'
                    title: string
                    description: string | null
                    related_id: string | null
                    is_read: boolean
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    team_id?: string | null
                    project_id?: string | null // 🔄 project_id を追加
                    user_id: string
                    sender_id?: string | null
                    type: 'task' | 'report' | 'system' | 'comment'
                    title: string
                    description?: string | null
                    related_id?: string | null
                    is_read?: boolean
                    created_at?: string | null
                }
                Update: Partial<Database['public']['Tables']['notifications']['Insert']>
                Relationships: [
                    {
                        foreignKeyName: 'notifications_user_id_fkey'
                        columns: ['user_id']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'notifications_sender_id_fkey'
                        columns: ['sender_id']
                        referencedRelation: 'profiles'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'notifications_team_id_fkey'
                        columns: ['team_id']
                        referencedRelation: 'teams'
                        referencedColumns: ['id']
                    },
                    {
                        foreignKeyName: 'notifications_project_id_fkey' // 🆕 project_id のリレーションシップを追加
                        columns: ['project_id']
                        referencedRelation: 'projects'
                        referencedColumns: ['id']
                    },
                ]
            }
        }

        // Viewを削除
        Views: Record<string, never>

        Functions: Record<string, never>
        Enums: Record<string, never>
    }
}

// 型,説明,使用例
// Database['public']['Tables']['profiles']['Row'],profiles テーブルからデータを取得する際の型。,const profile: Row<'profiles'> = await supabase.from('profiles').select().single()
// Database['public']['Tables']['profiles']['Insert'],profiles テーブルにデータを挿入する際の型。,await supabase.from('profiles').insert(data)
// Database['public']['Tables']['profiles']['Update'],profiles テーブルのデータを更新する際の型。,await supabase.from('profiles').update(data)
