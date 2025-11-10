// Modules
import { create } from 'zustand'
// import { persist } from 'zustand/middleware'
// Supabase
import type { ProjectWithDetails } from '@/lib/supabase/projectData'

interface ProjectState {
    project: ProjectWithDetails | null
    setProject: (project: ProjectWithDetails | null) => void
    clearProject: () => void
}

export const useProjectStore = create<ProjectState>()(
    // persist(
    (set) => ({
        project: null,
        setProject: (project) => set({ project: project }),
        clearProject: () => set({ project: null }),
    })
    //     { name: 'project' }
    // )
)
