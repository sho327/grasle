'use client'
// Modules
import React from 'react'
import { FolderOpen } from 'lucide-react'
// Types
import { ProjectWithDetails } from '@/lib/supabase/projectData'
// UI/Components
// import ProjectCard from '@/components/ui/ProjectCard'
// import { Separator } from '@/components/ui/separator'
// Layout/Components
import PageHeader from '@/components/layout/parts/page-header'

interface ProjectListClientProps {
    projects: ProjectWithDetails[]
}

/**
 * プロジェクト一覧ページ
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/03
 */
export default function ProjectListClient({ projects }: ProjectListClientProps) {
    // ============================================================================
    // 変数（Constant）
    // ============================================================================
    // プロジェクトの件数を表示
    const projectCount = projects.length

    // ============================================================================
    // テンプレート（コンポーネント描画処理）
    // ============================================================================
    return (
        <div className="mx-auto max-w-7xl space-y-6">
            {/* ページヘッダー */}
            <PageHeader
                Icon={FolderOpen}
                iconVariant="project-list"
                pageTitle="プロジェクト一覧"
                pageDescription="あなたが所属するプロジェクト一覧です。"
                isBackButton={false}
            />
        </div>
    )
}
