'use server'
// Modules
import { cookies } from 'next/headers'
// Constants
import { selectedTeamIdCookie } from '@/constants/selectedTeamIdCookie'

/**
 * ユーザーが選択したチームIDをCookieに保存するサーバーアクション
 * @param teamId 選択されたチームID
 */
export async function setSelectedTeamCookie(teamId: string) {
    // cookies() の戻り値を 'any' にキャストして型エラーを回避
    const cookieStore: any = await cookies()

    if (!teamId) {
        // IDが空の場合はCookieを削除（maxAge: 0で期限切れにして削除）
        cookieStore.set(selectedTeamIdCookie, '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0,
            path: '/',
        })
        return
    }

    // CookieにチームIDを保存
    cookieStore.set(selectedTeamIdCookie, teamId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
    })
}
