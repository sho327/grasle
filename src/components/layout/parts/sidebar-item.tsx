'use client'
// Modules
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
// UI/Components
import { Badge } from '@/components/ui/badge'
// Libs
import { cn } from '@/lib/utils'

interface SidebarItemProps {
    title: string
    href: string
    icon: LucideIcon
    badge?: string
    isPremium?: boolean
    isCompact?: boolean
}

/**
 * サイドバーアイテムコンポーネント
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/09
 */
export default function SidebarItem({
    title,
    href,
    icon: Icon,
    badge,
    isPremium,
    isCompact = false,
}: SidebarItemProps) {
    // ============================================================================
    // 変数（Constant）
    // ============================================================================
    const pathname = usePathname()
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

    // ============================================================================
    // テンプレート（Template）
    // ============================================================================
    return (
        <Link
            href={href}
            className={cn(
                'flex h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isPremium
                    ? isActive
                        ? 'bg-yellow-50 text-yellow-800'
                        : 'text-yellow-700 hover:bg-slate-50 hover:text-yellow-700'
                    : isActive
                      ? 'bg-blue-50 text-slate-700'
                      : 'text-sidebar-foreground hover:bg-blue-50 hover:text-slate-700',
                isCompact && 'py-1.5'
            )}
        >
            <Icon
                className={cn(
                    'h-4 w-4',
                    isPremium
                        ? isActive
                            ? 'text-yellow-800'
                            : 'text-yellow-700'
                        : isActive
                          ? 'text-slate-700'
                          : 'text-slate-600'
                )}
            />
            <span>{title}</span>
            {badge && (
                <Badge
                    variant="secondary"
                    className={cn(
                        'ml-auto text-xs',
                        isPremium
                            ? 'border-0 bg-gradient-to-r from-yellow-400 to-orange-600 text-white'
                            : 'border-green-200 bg-green-100 text-green-800'
                    )}
                >
                    {badge}
                </Badge>
            )}
        </Link>
    )
}
