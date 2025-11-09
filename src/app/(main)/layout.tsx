// Modules
import { cookies } from 'next/headers'
// UI/Components
import { SidebarProvider } from '@/components/ui/sidebar'
// Layout/Components
import { ClientMainLayout } from '@/components/layout/client-main-layout'
// Supabase
import { fetchAuthenticatedUserData } from '@/lib/supabase/userData'
// Actions
import { setSelectedTeamCookie } from '@/actions/teamActions'
// Constants
import { selectedTeamIdCookie } from '@/constants/selectedTeamIdCookie'

/**
 * メインレイアウト
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/02
 */
export default async function MainLayout({ children }: { children: React.ReactNode }) {
    // ============================================================================
    // 変数（Constant）
    // ============================================================================
    const profileWithTeams = await fetchAuthenticatedUserData()
    // *** Cookie/選択中チームID検証(ページよりも先に動くレイアウトで検証/再設定) ***
    // 1. Cookieから選択チームIDを安全に取得 (TSエラー回避のため as any を使用)
    const cookieStore = (await cookies()) as any
    const selectedTeamIdFromCookie: string | null =
        cookieStore.get(selectedTeamIdCookie)?.value || null
    // 2. 初期チームIDの決定ロジック
    const memberships = profileWithTeams?.memberships || []
    // 個人チームの特定
    const personalTeam = memberships.find((m: any) => m.teams.is_personal)?.teams || null
    const personalTeamId: string | null = personalTeam?.id || null
    let finalSelectedTeamId: string | null = null
    if (memberships.length === 0) {
        // 所属チームがない場合
        finalSelectedTeamId = null
    } else if (selectedTeamIdFromCookie) {
        // 3. Cookieが設定されている場合
        const isTeamExist = memberships.some((m: any) => m.teams.id === selectedTeamIdFromCookie)
        if (isTeamExist) {
            // 3C. 所属チームに存在する: CookieのIDを採用（現状維持）
            finalSelectedTeamId = selectedTeamIdFromCookie
        } else {
            // 3D. 所属チームに存在しない: 個人チームIDに切り替え
            finalSelectedTeamId = personalTeamId
        }
    } else {
        // 3A. Cookieが未設定の場合（初回アクセス）: 個人チームIDを採用
        finalSelectedTeamId = personalTeamId
    }
    // 注意: Server ComponentからはCookieを変更できないため、
    // Cookieの更新はクライアント側（ClientMainLayout）で行う
    const needsCookieUpdate = finalSelectedTeamId !== selectedTeamIdFromCookie

    // ============================================================================
    // テンプレート（Template）
    // ============================================================================
    return (
        <SidebarProvider defaultOpen={true}>
            <ClientMainLayout
                profileWithTeams={profileWithTeams}
                selectedTeamId={finalSelectedTeamId}
                needsCookieUpdate={needsCookieUpdate}
            >
                {children}
            </ClientMainLayout>
        </SidebarProvider>
    )
}
