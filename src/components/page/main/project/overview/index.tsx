'use client'
// Modules
import { Home } from 'lucide-react'
// Layout/Components
import PageHeader from '@/components/layout/parts/page-header'
// Layout/Components
import { useProjectStore } from '@/store/projectStore'

/**
 * プロジェクト概要ページ
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/03
 */
export default function ProjectOverviewPage() {
    // ============================================================================
    // グローバル状態（GlobalState）
    // ============================================================================
    const { project } = useProjectStore()
    console.log(project)

    // ============================================================================
    // テンプレート（コンポーネント描画処理）
    // ============================================================================
    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* ページヘッダー */}
            <PageHeader
                Icon={Home}
                iconVariant="home"
                pageTitle="プロジェクト概要"
                pageDescription="プロジェクトの概要です。"
                isBackButton={false}
            />
        </div>
    )
}
