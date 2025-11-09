import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// Supabase
import type { ProfileWithTeams } from '@/lib/supabase/userData'

interface ProfileWithTeamsState {
    profileWithTeams: ProfileWithTeams | null
    setProfileWithTeams: (user: ProfileWithTeams | null) => void
    clearProfileWithTeams: () => void
}

export const useProfileWithTeamsStore = create<ProfileWithTeamsState>()(
    persist(
        (set) => ({
            profileWithTeams: null,
            setProfileWithTeams: (profileWithTeams) => set({ profileWithTeams: profileWithTeams }),
            clearProfileWithTeams: () => set({ profileWithTeams: null }),
        }),
        { name: 'profile-with-teams' }
    )
)
