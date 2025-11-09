'use client'
// Modules
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FolderOpen } from 'lucide-react'
// Libs
import { cn } from '@/lib/utils'

/**
 * 下部ナビゲーションコンポーネント
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/09
 */
export default function BottomNavigation() {
    // ============================================================================
    // 変数（Constant）
    // ============================================================================
    const pathname = usePathname()
    const navItems = [
        {
            icon: LayoutDashboard,
            label: 'ダッシュボード',
            href: '/',
        },
        {
            icon: FolderOpen,
            label: 'プロジェクト',
            href: '/projects',
        },
    ]

    // ============================================================================
    // テンプレート（コンポーネント描画処理）
    // ============================================================================
    return (
        <nav className="border-border bg-card fixed right-0 bottom-0 left-0 z-2 border-t md:hidden">
            <div className="flex h-16 items-center justify-around">
                {navItems.map((navItem) => {
                    const Icon = navItem.icon
                    const isActive = pathname === navItem.href

                    return (
                        <Link
                            key={navItem.href}
                            href={navItem.href}
                            className={cn(
                                'flex flex-col items-center justify-center gap-1 px-4 py-2 text-xs transition-colors',
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{navItem.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
