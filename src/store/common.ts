// Modules
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TeamRow } from '@/types/team'

interface CommonState {
    /* 選択中チーム */
    selectTeam: TeamRow | null
    setSelectTeam: (selectTeam: TeamRow | null) => void
    clearSelectTeam: () => void

    /* 選択中テーマ */
    theme: 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
    toggleTheme: () => void

    /* ページローディング */
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
}

export const useCommonStore = create<CommonState>()(
    persist(
        (set, get) => ({
            /* 選択中チーム */
            selectTeam: null,
            setSelectTeam: (selectTeam) => set({ selectTeam: selectTeam }),
            clearSelectTeam: () => set({ selectTeam: null }),

            /* 選択中テーマ */
            theme: 'light',
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),

            /* ページローディング */
            isLoading: false,
            setIsLoading: (isLoading) => set({ isLoading: isLoading }),
        }),
        { name: 'common' }
    )
)
