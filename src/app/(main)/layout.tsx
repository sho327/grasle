// Layout/Components
import { ClientMainLayout } from '@/components/layout/client-main-layout'
// Libs/ServerUtils
import { getSessionData } from '@/lib/server-utils/getSessionData'

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
    const {
        profileWithTeams,
        selectedTeamId: finalSelectedTeamId,
        needsCookieUpdate,
    } = await getSessionData()

    // ============================================================================
    // テンプレート（Template）
    // ============================================================================
    return (
        <ClientMainLayout
            profileWithTeams={profileWithTeams}
            selectedTeamId={finalSelectedTeamId}
            needsCookieUpdate={needsCookieUpdate}
        >
            {children}
        </ClientMainLayout>
    )
}
