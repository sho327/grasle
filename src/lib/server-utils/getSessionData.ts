// Modules
import { cookies } from 'next/headers'
// Supabase
import { fetchAuthenticatedUserData, ProfileWithTeams } from '@/lib/supabase/userData'
// Constants
import { selectedTeamIdCookie } from '@/constants/selectedTeamIdCookie'

interface SessionData {
    profileWithTeams: ProfileWithTeams | null
    selectedTeamId: string | null
    needsCookieUpdate: boolean
}

/**
 * 認証ユーザーのプロフィールを取得し、選択中のチームIDを検証/決定する Server Utility 関数
 * @returns {SessionData} 認証データと最終的な選択チームID、Cookie更新フラグ
 */
export async function getSessionData(): Promise<SessionData> {
    // 1. プロファイルとチーム情報を取得
    const profileWithTeams = await fetchAuthenticatedUserData()

    // 2. Cookieから選択チームIDを安全に取得
    const cookieStore = await cookies()
    const selectedTeamIdFromCookie: string | null =
        cookieStore.get(selectedTeamIdCookie)?.value || null

    // 3. チームIDの検証と決定ロジック
    const memberships = profileWithTeams?.memberships || []
    const personalTeam = memberships.find((m: any) => m.teams.is_personal)?.teams || null
    const personalTeamId: string | null = personalTeam?.id || null

    let finalSelectedTeamId: string | null = null

    if (memberships.length === 0) {
        // 所属チームがない場合
        finalSelectedTeamId = null
    } else if (selectedTeamIdFromCookie) {
        // Cookieが設定されている場合
        const isTeamExist = memberships.some((m: any) => m.teams.id === selectedTeamIdFromCookie)
        if (isTeamExist) {
            finalSelectedTeamId = selectedTeamIdFromCookie
        } else {
            // 存在しない場合、個人チームに切り替え
            finalSelectedTeamId = personalTeamId
        }
    } else {
        // Cookieが未設定の場合（初回アクセス）: 個人チームIDを採用
        finalSelectedTeamId = personalTeamId
    }

    // Cookieの更新が必要かどうかのフラグ
    const needsCookieUpdate = finalSelectedTeamId !== selectedTeamIdFromCookie

    return {
        profileWithTeams,
        selectedTeamId: finalSelectedTeamId,
        needsCookieUpdate,
    }
}
