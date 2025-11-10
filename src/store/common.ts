// Modules
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TeamRow } from '@/types/team'

interface CommonState {
    /* 選択中チーム */
    selectTeam: TeamRow | null
    setSelectTeam: (selectTeam: TeamRow | null) => void
    clearSelectTeam: () => void

    /* ページローディング */
    isLoading: boolean
    setIsLoading: (isLoading: boolean) => void
}

export const useCommonStore = create<CommonState>()((set, get) => ({
    /* 選択中チーム */
    selectTeam: null,
    setSelectTeam: (selectTeam) => set({ selectTeam: selectTeam }),
    clearSelectTeam: () => set({ selectTeam: null }),

    /* ページローディング */
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading: isLoading }),
}))

interface LocalStorageCommonState {
    /* 選択中テーマ */
    theme: 'light' | 'dark'
    setTheme: (theme: 'light' | 'dark') => void
    toggleTheme: () => void
}

export const useLocalStorageCommonStore = create<LocalStorageCommonState>()(
    persist(
        (set, get) => ({
            /* 選択中テーマ */
            theme: 'light',
            setTheme: (theme) => set({ theme }),
            toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
        }),
        { name: 'common' }
    )
)
