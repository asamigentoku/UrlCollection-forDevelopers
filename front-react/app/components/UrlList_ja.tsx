"use client";
import { useState, useMemo } from "react";
import { useUrlCollection } from "../hooks/fetchData";
import { UrlItem } from "../types/urls_type";

const COLOR_PALETTE = [
    { bg: "#f3e8ff", text: "#7e22ce" },
    { bg: "#dcfce7", text: "#15803d" },
    { bg: "#dbeafe", text: "#1d4ed8" },
    { bg: "#ffedd5", text: "#c2410c" },
    { bg: "#fce7f3", text: "#9d174d" },
    { bg: "#fef9c3", text: "#854d0e" },
    { bg: "#e0f2fe", text: "#0369a1" },
];

function ExternalLinkIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
    );
}

export default function UrlList_ja() {
    const { items, loading, error } = useUrlCollection();
    const [searchQuery, setSearchQuery]           = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("すべて");

    const categoryColorMap = useMemo(() => {
        const categories = Array.from(new Set(items.map(item => item.category)));
        return Object.fromEntries(
            categories.map((cat, i) => [cat, COLOR_PALETTE[i % COLOR_PALETTE.length]])
        );
    }, [items]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <p className="text-gray-400 text-sm">読み込み中...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex items-center justify-center py-32">
                <p className="text-red-500 text-sm">エラー: {error.message}</p>
            </div>
        );
    }

    const categories = Array.from(new Set(items.map(item => item.category)));

    const filteredItems = items.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
                         || item.url.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat    = selectedCategory === "すべて" || item.category === selectedCategory;
        return matchSearch && matchCat;
    });

    return (
        <div className="min-h-screen bg-white" >
            {/* 検索バー + カテゴリタブ (sticky) */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 space-y-3">
                {/* 検索 */}
                <div className="max-w-2xl mx-auto relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="ツールやURLを検索..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 placeholder-gray-400"
                    />
                </div>

                {/* カテゴリタブ */}
                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setSelectedCategory("すべて")}
                        className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
                        style={selectedCategory === "すべて"
                            ? { backgroundColor: "#111827", color: "#ffffff", borderColor: "#111827" }
                            : { backgroundColor: "#ffffff", color: "#4b5563", borderColor: "#e5e7eb" }
                        }
                    >
                        すべて
                    </button>
                    {categories.map(cat => {
                        const active = selectedCategory === cat;
                        const color  = categoryColorMap[cat] ?? { bg: "#f3f4f6", text: "#374151" };
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
                                style={active
                                    ? { backgroundColor: color.text, color: "#ffffff", borderColor: color.text }
                                    : { backgroundColor: color.bg,   color: color.text, borderColor: "transparent" }
                                }
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* コンテンツ */}
            <div className="max-w-6xl mx-auto px-8 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCategory === "すべて" ? "全ての公式ドキュメント" : selectedCategory}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {filteredItems.length} 件
                    </p>
                </div>

                {filteredItems.length === 0 ? (
                    <p className="text-gray-400 text-sm">該当するURLが見つかりません。</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredItems.map((item: UrlItem) => {
                            return (
                                <a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="border border-gray-200 rounded-2xl p-5 hover:shadow-md hover:border-gray-300 transition-all bg-white flex flex-col cursor-pointer group"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">{item.name}</h3>
                                    <p className="text-sm text-gray-400 mb-4 truncate">{item.url}</p>
                                    <div className="flex items-center justify-end mt-auto">
                                        <ExternalLinkIcon />
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}