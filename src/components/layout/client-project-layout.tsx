'use client'
// Modules
import type React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// UI/Components
import { SidebarInset } from '@/components/ui/sidebar'
// Layout/Components
import Header from '@/components/layout/parts/header'
import BottomNavigation from '@/components/layout/parts/bottom-navigation'
import Sidebar from '@/components/layout/parts/sidebar'
import ProjectTabNavigation from '@/components/layout/parts/project-tab-navigation'
// Types
import type { TeamRow } from '@/types/team'
// Store
import { useCommonStore } from '@/store/common'
import { useProjectStore } from '@/store/projectStore'
// Hooks
import { useIsMobile } from '@/hooks/use-mobile'
// Supabase
import type { ProfileWithTeams } from '@/lib/supabase/userData'
import { ProjectWithDetails } from '@/lib/supabase/projectData'
// Actions
import { setSelectedTeamCookie } from '@/actions/teamActions'

interface ClientProjectLayoutProps {
    children: React.ReactNode
    profileWithTeams: ProfileWithTeams | null
    selectedTeamId: string | null
    needsCookieUpdate?: boolean // Cookie更新が必要かどうか
    project: ProjectWithDetails | null
    error: string | null
}

/**
 * プロジェクトレイアウトコンポーネント(クライアントコンポーネント)
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/10
 */
export function ClientProjectLayout({
    children,
    profileWithTeams,
    selectedTeamId,
    needsCookieUpdate,
    project,
    error,
}: ClientProjectLayoutProps) {
    // ============================================================================
    // 変数（Constant）
    // ============================================================================
    const isMobile = useIsMobile()
    const router = useRouter()
    // 最初に表示すべきチームオブジェクトを計算するヘルパー関数 (純粋関数)
    const getInitialTeam = (
        id: string | null,
        profileData: ProfileWithTeams | null
    ): TeamRow | null => {
        const memberships = profileData?.memberships || []
        if (memberships.length === 0) return null

        // 1. Props で渡された ID に対応するチームオブジェクトを探す
        const selectedMembership = memberships.find((m) => m.teams.id === id)
        if (selectedMembership) return selectedMembership.teams

        // 2. IDが無効または未設定の場合、個人チームを探す
        return memberships.find((m) => m.teams.is_personal)?.teams || null
    }

    // ============================================================================
    // ローカル状態（LocalState）
    // ============================================================================
    const [currentTeam, setCurrentGroup] = useState<TeamRow | null>(() => {
        return getInitialTeam(selectedTeamId, profileWithTeams)
    })

    // ============================================================================
    // グローバル状態（GlobalState）
    // ============================================================================
    const { isLoading, setIsLoading } = useCommonStore()
    const { setProject } = useProjectStore()

    // ============================================================================
    // Effect(Watch)処理（Effect(Watch)）
    // ============================================================================
    /* 選択中チームに対するWatch処理 */
    useEffect(() => {
        // 1. 選択中チームの表示設定
        // 既に setCurrentGroup が実行済みの場合、Props が変わったときだけ更新
        const newTeam = getInitialTeam(selectedTeamId, profileWithTeams)
        if (newTeam?.id !== currentTeam?.id) {
            setCurrentGroup(newTeam)
        }
        // 2. Cookie更新が必要な場合、クライアント側からServer Actionを呼び出してCookieを更新
        if (needsCookieUpdate) {
            if (selectedTeamId) {
                setSelectedTeamCookie(selectedTeamId)
            } else {
                setSelectedTeamCookie('')
            }
            // Cookie更新後、Server Componentを再レンダリングして新しいCookieの値を読み込む
            router.refresh()
        }
        // 4. ローディング終了処理
        if (isLoading) {
            // Propsが更新された = サーバーからの応答が完了した
            setIsLoading(false)
            console.log('Loading reset complete via ClientMainLayout.')
        }
    }, [profileWithTeams, selectedTeamId, needsCookieUpdate, currentTeam?.id, router])
    /* 選択中プロジェクトに対するWatch処理(ストアへのプロジェクト保存) */
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
    // Define(Computed)処理(状態等による変数定義)
    // ============================================================================
    // currentProject が null でない、かつ ID がある場合に true
    const isProjectSelected = !!project?.id

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
            <Sidebar profileWithTeams={profileWithTeams} selectTeam={currentTeam} />
            {/* メインコンテンツ(ヘッダー 〜 下部ナビゲーション) */}
            <SidebarInset className="flex h-screen flex-col overflow-scroll">
                {/* ヘッダー */}
                <Header profileWithTeams={profileWithTeams} project={project} />

                {/* プロジェクト選択時/上部ナビゲーション */}
                <ProjectTabNavigation projectId={project.id} />

                {/* メインコンテンツ */}
                <main className="container mx-auto px-3 py-5.5 sm:px-6 sm:py-6">{children}</main>

                {/* プロジェクト未選択時 + モバイルの場合/下部ナビゲーション */}
                {!isProjectSelected && isMobile && <BottomNavigation />}
            </SidebarInset>
        </>
    )
}
