'use client'
// Modules
import React from 'react'
import Link from 'next/link'
import { FolderOpen, Star, Calendar, Users, MoreHorizontal, ListChecks } from 'lucide-react'
import { formatDistanceToNowStrict } from 'date-fns' // // 🚨 更新日の表示に使う (要インストール: date-fns)
import { ja } from 'date-fns/locale'
// Types
import { ProjectWithDetails } from '@/lib/supabase/projectData'
// UI/Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { Button } from '@/components/ui/button' // ボタンは今回は不要
// Layout/Components
import PageHeader from '@/components/layout/parts/page-header'

import { Button } from '@/components/ui/button'

interface ProjectListProps {
    projects: ProjectWithDetails[]
}

// ----------------------------------------------------
// ヘルパー関数 (タスク進捗計算)
// ----------------------------------------------------
// ProjectWithDetails には tasks: TaskCount[] が含まれているが、ここでは仮の進捗データを使用
// 実際にはタスクテーブルから完了/合計件数を取得する必要があります
const calculateProgress = (project: ProjectWithDetails) => {
    // ⚠️ 暫定値: tasks: [{ count: N }] はタスクの総件数のみの場合があるため、ここでは仮の進捗率を計算
    // 実際のアプリケーションでは、タスクテーブルから完了したタスクの数を取得して進捗率を計算してください。

    // 仮にタスク総数を取得
    const totalTasks = project.tasks?.[0]?.count || 0

    // 仮に、進捗率はIDの長さに基づいて決定 (デモ用)
    const progressValue = totalTasks > 0 ? (project.id.length * 5) % 100 : 0

    // 完了タスク数も仮で計算
    const completedTasks = Math.floor(totalTasks * (progressValue / 100))

    return { totalTasks, completedTasks, progressValue }
}

/**
 * プロジェクト一覧ページ
 * @args
 * @createdBy KatoShogo
 * @createdAt 2025/11/03
 */
export default function ProjectList({ projects }: ProjectListProps) {
    // ============================================================================
    // 変数（Constant）
    // ============================================================================
    // プロジェクトの件数を表示
    const projectCount = projects.length

    // ============================================================================
    // テンプレート（コンポーネント描画処理）
    // ============================================================================
    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <PageHeader
                Icon={FolderOpen}
                // iconVariant="project-list"
                iconVariant="home"
                pageTitle="プロジェクト一覧"
                pageDescription="あなたが所属するプロジェクト一覧です。"
                isBackButton={false}
            />

            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => {
                    // 仮の進捗計算
                    const { totalTasks, completedTasks, progressValue } = calculateProgress(project)
                    // 最終更新からどれだけ時間が経過したかを計算 (date-fnsが必要)
                    const updatedText = formatDistanceToNowStrict(new Date(project.updated_at), {
                        addSuffix: true,
                        locale: ja,
                    })

                    return (
                        <Card
                            key={project.id}
                            className="flex h-full flex-col rounded-lg border border-slate-200 bg-white pt-2 pb-1.5 shadow-xs transition-shadow hover:shadow-lg"
                        >
                            {/* カードボディ: 上部メタ情報/タイトル/説明 */}
                            <div className="flex flex-grow flex-col px-4 py-4 pb-1.5">
                                {/* 1. ヘッダー/メタ情報 (最終更新, お気に入り、ドロップダウン) */}
                                <div className="mb-3.5 flex items-start justify-between">
                                    <div className="flex-grow">
                                        <p className="text-xs text-slate-500">
                                            最終更新: {updatedText}
                                        </p>
                                    </div>
                                    {/* お気に入り/ドロップダウン */}
                                    <div className="flex items-center gap-2">
                                        {' '}
                                        {/* お気に入りボタン */}
                                        <button
                                            type="button"
                                            className="-mt-1 p-1 text-amber-500 transition-colors hover:text-amber-600"
                                        >
                                            <Star className="h-4 w-4 fill-amber-500" />{' '}
                                        </button>
                                        {/* ドロップダウン */}
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="btn btn-link text-muted -mt-2 p-1">
                                                    <MoreHorizontal className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            {/* ... DropdownMenuContent は省略 ... */}
                                        </DropdownMenu>
                                    </div>
                                </div>

                                {/* 2. アイコン, タイトル, 説明(リンク) */}
                                <Link
                                    href={`/project/${project.id}/overview`}
                                    passHref
                                    className="mb-1.5 flex min-h-0 flex-grow"
                                >
                                    <div className="mr-3 flex-shrink-0">
                                        {/* アイコン/ロゴの代替 */}
                                        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded p-1">
                                            <FolderOpen className="text-primary h-6 w-6" />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-grow">
                                        <CardTitle className="hover:text-primary mb-1 line-clamp-2 text-base font-semibold text-slate-900 transition-colors">
                                            {project.name}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs text-slate-500">
                                            {project.description}
                                        </CardDescription>
                                    </div>
                                </Link>

                                {/* 3. 進捗状況 (Progress) */}
                                <div className="mt-auto pt-2">
                                    <div className="mb-1.5 flex items-center justify-between text-xs">
                                        {' '}
                                        <div className="text-slate-600">進捗率</div>
                                        <div className="flex items-center text-slate-600">
                                            <ListChecks className="text-muted mr-1 h-4 w-4" />{' '}
                                            {completedTasks}/{totalTasks}
                                        </div>
                                    </div>
                                    <Progress value={progressValue} className="h-1.5 bg-gray-200">
                                        {/* Progressコンポーネントが背景とバーを制御 */}
                                    </Progress>
                                </div>
                            </div>

                            {/* Card Footer: アバターと期日 */}
                            <div className="mb-2 border-t border-dashed border-slate-200 px-4 pt-2">
                                <div className="flex items-center justify-between">
                                    {/* 1. アバターグループ (メンバーシップ) */}
                                    <div className="flex-grow">
                                        <div className="flex -space-x-1.5">
                                            {' '}
                                            <Avatar className="h-7 w-7 border-2 border-white">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                    K
                                                </AvatarFallback>
                                            </Avatar>
                                            <Avatar className="h-7 w-7 border-2 border-white">
                                                <AvatarFallback className="bg-green-100 text-xs text-green-700">
                                                    S
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="border-primary bg-light text-primary hover:bg-primary-50 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-dashed text-xs transition-colors">
                                                +
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2. 期日 */}
                                    <div className="text-muted flex-shrink-0 text-xs text-slate-600">
                                        <Calendar className="mr-1 inline h-4 w-4 align-bottom" />{' '}
                                        {project.end_date
                                            ? new Date(project.end_date)
                                                  .toLocaleDateString('ja-JP', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                  .replace(/\//g, ' ')
                                            : '期日未定'}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )
                })}
            </div>

            {/* EmptyState(空の場合の表示) */}
            {/* ... */}
        </div>
    )
}
