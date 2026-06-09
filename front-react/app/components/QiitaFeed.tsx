"use client";
import { useQuery } from "@tanstack/react-query";
import { QiitaItem } from "../types/qiita_type";

async function fetchQiitaItems(): Promise<QiitaItem[]> {
    const res = await fetch(
        "https://qiita.com/api/v2/items?page=1&per_page=20&query=created:%3E2026-05-02"

    );
    if (!res.ok) throw new Error(`Qiita API error: ${res.status}`);
    return res.json();
}

function HeartIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
    );
}

function ExternalLinkIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    );
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" });
}

export default function QiitaFeed({ isEnglish = false }: { isEnglish?: boolean }) {
    const { data, isLoading, isError, error } = useQuery<QiitaItem[]>({
        queryKey: ["qiita-trending"],
        queryFn: fetchQiitaItems,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <p className="text-gray-400 text-sm">{isEnglish ? "Loading..." : "読み込み中..."}</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center py-32">
                <p className="text-red-500 text-sm">
                    {isEnglish ? "Error: " : "エラー: "}
                    {error instanceof Error ? error.message : (isEnglish ? "Failed to fetch" : "取得に失敗しました")}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-6xl mx-auto px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{isEnglish ? "Qiita Trending" : "Qiita トレンド"}</h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {isEnglish
                            ? `Recent articles — ${data?.length ?? 0} results`
                            : `直近の記事 — ${data?.length ?? 0} 件`}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.map((item) => (
                        <a
                            key={item.id}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition-all bg-white flex flex-col gap-3 cursor-pointer group"
                        >
                            {/* タグ */}
                            {item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {item.tags.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag.name}
                                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                                            style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}
                                        >
                                            {tag.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* タイトル */}
                            <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-gray-600 transition-colors line-clamp-3">
                                {item.title}
                            </h3>

                            {/* フッター */}
                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-2">
                                    {item.user.profile_image_url && (
                                        <img
                                            src={item.user.profile_image_url}
                                            alt={item.user.id}
                                            className="w-5 h-5 rounded-full"
                                        />
                                    )}
                                    <span className="text-xs text-gray-400">{item.user.id}</span>
                                    <span className="text-xs text-gray-300">·</span>
                                    <span className="text-xs text-gray-400">{formatDate(item.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-pink-500 text-xs font-semibold">
                                    <HeartIcon />
                                    {item.likes_count}
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <span className="text-gray-300 group-hover:text-gray-500 transition-colors">
                                    <ExternalLinkIcon />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
