// Layout/Components
import { ClientProjectLayout } from '@/components/layout/client-project-layout'
// Supabase
import { fetchProjectDetails, ProjectWithDetails } from '@/lib/supabase/projectData'

interface ProjectLayoutProps {
    children: React.ReactNode
    params: { projectId: string }
}

/**
 * プロジェクトレイアウト
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/10
 */
export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
    // ============================================================================
    // 変数（Constant）
    // ============================================================================
    const { projectId } = params
    // 1. データ取得
    // ----------------------------------------
    let project: ProjectWithDetails | null = null
    let error: string | null = null

    // RLSが適用される関数を使用してデータを取得
    const fetchedProject = await fetchProjectDetails(projectId)
    if (fetchedProject) {
        project = fetchedProject
    } else {
        // fetchProjectDetails 内で認証チェックとエラーログは既に行われているが、
        // nullが返された場合はユーザーフレンドリーなエラーを設定
        error =
            'プロジェクトのロードに失敗しました。プロジェクトIDが存在しないか、アクセス権限がありません。'
    }

    // ============================================================================
    // テンプレート（Template）
    // ============================================================================
    return (
        <ClientProjectLayout project={project} error={error}>
            {children}
        </ClientProjectLayout>
    )
}
