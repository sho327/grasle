// Modules
import { supabaseServer } from './server'
import type { User } from '@supabase/supabase-js'
// Types
import { TeamRow } from '@/types/team'
import { MembershipRow } from '@/types/membership'
import { ProfileRow } from '@/types/profile'

// Memberships の Row に、関連する Teams の情報（teams）をネストして追加
export type MembershipWithTeam = MembershipRow & {
    teams: TeamRow
}
// プロフィールの Row に、関連する MembershipWithTeam のリスト（memberships）をネストして追加
export type ProfileWithTeams = ProfileRow & {
    // profileWithTeams が null でない場合、TypeScriptは memberships が null ではなく配列（[] または [...リスト]）であると判定
    memberships: MembershipWithTeam[]
}

// ----------------------------------------------------
// 認証済みユーザーのプロフィールとチームを取得する関数
// ----------------------------------------------------
/**
 * 現在ログインしているユーザーセッション情報を取得
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/03
 */
export const getSessionUser = async (): Promise<User | null> => {
    // ... (以前のロジック: userを取得)
    const supabase = await supabaseServer()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return null
    return data.user
}

/**
 * 認証済みユーザーのプロフィールと所属チーム一覧をフェッチする
 * ----------------------------------------------------
 * 項目	ロジック	結果
 * profileWithGroupsが"null"の場合	profileWithGroups?.memberships	undefined
 * profileWithGroupsが"オブジェクト"の場合	profileWithGroups.memberships	MembershipWithGroup[](空または中身あり)
 * ----------------------------------------------------
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/03
 */
export async function fetchAuthenticatedUserData(): Promise<ProfileWithTeams | null> {
    const user = await getSessionUser()
    if (!user) {
        return null
    }

    const supabase = await supabaseServer()

    const { data: profileData, error } = await supabase
        .from('profiles')
        .select(
            `
				id,
				name,
				avatar_url,
				theme,
				created_at,
				memberships!memberships_user_id_fkey( 
					id,
					user_id,
					team_id,
					role,
					status,
					teams(*)
				)
			`
        )
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching user data in server utils:', error.message)
        return null
    }

    // `as unknown as ProfileWithTeams` で型キャストを強制
    // (ランタイムのデータ構造は正しいため、パーサーエラーを回避するために使用)
    return profileData as unknown as ProfileWithTeams
}

// ============================================================================
// ロール別フィルタリングの利用方法
// ============================================================================
// const profileData = await fetchAuthenticatedUserData();
// if (profileData) {
//     // 例: 自分が 'admin' の役割を持っているチームだけを抽出したい場合
//     const adminMemberships = profileData.memberships.filter(m => m.role === 'admin');

//     // 例: 自分が所属するチーム全体のリスト（ロールは問わない）
//     const allTeams = profileData.memberships.map(m => m.teams);

//     // 例: 個人チームを特定する
//     const personalTeam = profileData.memberships.find(m => m.teams.is_personal)?.teams;
// }
