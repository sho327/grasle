'use client'
// Modules
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CheckSquare, Users, Settings } from 'lucide-react'
// UI/Components
import { Button } from '@/components/ui/button'
// Hooks
import { useIsMobile } from '@/hooks/use-mobile'
// Libs
import { cn } from '@/lib/utils'

interface ProjectTabNavigationProps {
    projectId: string
}

/**
 * プロジェクト選択時タブナビゲーションコンポーネント
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/09
 */
export default function ProjectTabNavigation({ projectId }: ProjectTabNavigationProps) {
    // ============================================================================
    // 変数（Constant）
    // ============================================================================
    const pathname = usePathname()
    const isMobile = useIsMobile()
    const navItems = [
        { label: '概要', icon: LayoutDashboard, href: `/project/${projectId}/overview` },
        // { label: '概要', icon: LayoutDashboard, href: `/project/${projectId}` },
        { label: 'タスク', icon: CheckSquare, href: `/project/${projectId}/tasks` },
        { label: 'メンバー', icon: Users, href: `/project/${projectId}/members` },
        { label: '設定', icon: Settings, href: `/project/${projectId}/settings` },
    ]

    // ============================================================================
    // テンプレート（コンポーネント描画処理）
    // ============================================================================
    return (
        <nav className="border-border bg-card/80 sticky top-13.25 z-40 border-b shadow-xs backdrop-blur-sm">
            {/* PCの場合 */}
            {!isMobile && (
                <div className="container-fluid mx-auto px-4 lg:px-6">
                    <div className="flex items-center gap-1 overflow-x-auto py-2">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant={isActive ? 'default' : 'ghost'}
                                        size="sm"
                                        className={cn(
                                            'cursor-pointer rounded-lg whitespace-nowrap',
                                            isActive
                                                ? 'shadow-sm'
                                                : 'hover:bg-primary/10 hover:text-gray-700'
                                        )}
                                    >
                                        <Icon className="mr-1.5 h-4 w-4" />
                                        {item.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
            {/* スマホの場合 */}
            {isMobile && (
                <div className="flex overflow-x-auto">
                    {navItems.map((navItem) => {
                        const Icon = navItem.icon
                        const isActive = pathname === navItem.href
                        return (
                            <Link
                                key={navItem.href}
                                href={navItem.href}
                                className={cn(
                                    'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                                    isActive
                                        ? 'border-primary text-primary'
                                        : 'text-muted-foreground hover:text-foreground hover:border-border border-transparent'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{navItem.label}</span>
                            </Link>
                        )
                    })}
                </div>
            )}
        </nav>
    )
}
