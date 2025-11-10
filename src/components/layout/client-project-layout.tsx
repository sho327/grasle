'use client'
// Modules
import type React from 'react'
import { useEffect } from 'react'
// Layout/Components
import ProjectTabNavigation from '@/components/layout/parts/project-tab-navigation'
import { useProjectStore } from '@/store/projectStore'
// Supabase
import { ProjectWithDetails } from '@/lib/supabase/projectData'

interface ClientProjectLayoutProps {
    children: React.ReactNode
    project: ProjectWithDetails | null
    error: string | null
}

/**
 * プロジェクトレイアウトコンポーネント(クライアントコンポーネント)
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/10
 */
export function ClientProjectLayout({ children, project, error }: ClientProjectLayoutProps) {
    // ============================================================================
    // グローバル状態（GlobalState）
    // ============================================================================
    const { setProject } = useProjectStore()

    // ============================================================================
    // Effect(Watch)処理（Effect(Watch)）
    // ============================================================================
    useEffect(() => {
        if (project) {
            // プロジェクトデータがあれば、ストアに名前を設定
            setProject(project)
        } else {
            // データがない場合（例：エラー時）、ストアをクリア
            setProject(null)
        }

        // クリーンアップ関数: コンポーネントがアンマウントされるときにストアをクリア
        return () => {
            setProject(null)
        }
    }, [project, setProject]) // project が変更されたときだけ実行

    // ============================================================================
    // テンプレート（コンポーネント描画処理）
    // ============================================================================
    // データのロードエラー、またはプロジェクトが見つからない場合の表示
    if (error || !project) {
        // ... (エラー表示ロジック) ...
        return <div className="p-8">{/* ... エラーアラートの表示 ... */}</div>
    }
    return (
        <>
            {/* プロジェクト選択時/上部ナビゲーション */}
            <ProjectTabNavigation projectId="xxx" />

            {/* ボディ箇所 */}
            <main className="container mx-auto px-3 py-5.5 sm:px-6 sm:py-6">{children}</main>
        </>
    )
}
