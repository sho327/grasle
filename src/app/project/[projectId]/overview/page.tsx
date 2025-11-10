// Modules
import { redirect } from 'next/navigation'
// Page/Components
import ProjectOverview from '@/components/page/main/project/overview'

/**
 * プロジェク概要ページ
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/09
 */
export default async function ProjectOverviewPage() {
    // ============================================================================
    // テンプレート（Template）
    // ============================================================================
    return <ProjectOverview />
}
