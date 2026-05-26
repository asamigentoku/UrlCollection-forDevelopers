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

export default function UrlList_en() {
    const { items, loading, error } = useUrlCollection();
    const [searchQuery, setSearchQuery]           = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const categoryColorMap = useMemo(() => {
        const categories = Array.from(new Set(items.map(item => item.category)));
        return Object.fromEntries(
            categories.map((cat, i) => [cat, COLOR_PALETTE[i % COLOR_PALETTE.length]])
        );
    }, [items]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <p className="text-gray-400 text-sm">Loading...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex items-center justify-center py-32">
                <p className="text-red-500 text-sm">Error: {error.message}</p>
            </div>
        );
    }

    const categories = Array.from(new Set(items.map(item => item.category)));

    const filteredItems = items.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
                         || item.url.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCat    = selectedCategory === "All" || item.category === selectedCategory;
        return matchSearch && matchCat;
    });

    return (
        <div className="bg-white">
            {/* Search + Category tabs (sticky) */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 space-y-3">
                <div className="max-w-2xl mx-auto relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <SearchIcon />
                    </span>
                    <input
                        type="text"
                        placeholder="Search tools or URLs..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-gray-50 placeholder-gray-400 transition"
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                    <button
                        onClick={() => setSelectedCategory("All")}
                        className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
                        style={selectedCategory === "All"
                            ? { backgroundColor: "#0f172a", color: "#ffffff", borderColor: "#0f172a" }
                            : { backgroundColor: "#ffffff", color: "#4b5563", borderColor: "#e5e7eb" }
                        }
                    >
                        All
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

            {/* Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCategory === "All" ? "All Official Documentation" : selectedCategory}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {filteredItems.length === 0 ? (
                    <p className="text-gray-400 text-sm py-16 text-center">No documentation found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredItems.map((item: UrlItem) => (
                            <a
                                key={item.id}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-gray-300 transition-all bg-white flex flex-col group"
                            >
                                <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-gray-400 mb-4 truncate">{item.url}</p>
                                <div className="flex items-center justify-end mt-auto text-gray-300 group-hover:text-blue-400 transition-colors">
                                    <ExternalLinkIcon />
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}