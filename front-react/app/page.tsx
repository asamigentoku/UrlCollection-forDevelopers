"use client"
import UrlList_ja from "@/app/components/UrlList_ja";
import UrlList_en from "@/app/components/UrlList_en";
import { useState } from "react";

export default function Home() {
  const [isEnglish, setIsEnglish] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#ffffff" }}>

      {/* ── ナビゲーションヘッダー ── */}
      <header
        className="flex items-center justify-end px-8 py-4"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        {/* 言語トグル */}
        <div
          className="flex items-center rounded-full p-1 gap-1"
          style={{ backgroundColor: "#1f1f1f" }}
        >
          <button
            onClick={() => setIsEnglish(false)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={!isEnglish
              ? { backgroundColor: "#ffffff", color: "#0a0a0a" }
              : { backgroundColor: "transparent", color: "#6b7280" }
            }
          >
            JA
          </button>
          <button
            onClick={() => setIsEnglish(true)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
            style={isEnglish
              ? { backgroundColor: "#ffffff", color: "#0a0a0a" }
              : { backgroundColor: "transparent", color: "#6b7280" }
            }
          >
            EN
          </button>
        </div>
      </header>

      {/* ── ヒーローセクション ── */}
      <section
        className="px-8 py-10 text-center relative"
        style={{ backgroundImage: "url('/program.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        {/* 暗いオーバーレイ（テキスト可読性向上） */}
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.55)" }} />
        <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-3">
          {/* バッジ */}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: "#172554", color: "#93c5fd", border: "1px solid #1e40af" }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
            {isEnglish ? "Official sources only" : "公式ソースのみ厳選"}
          </span>

          {/* タイトル */}
          <h1 className="text-2xl font-bold text-white leading-snug">
            {isEnglish
              ? <>Official Documentation for Engineers Worldwide</>
              : <>全世界のエンジニアのための公式ドキュメント集</>
            }
          </h1>

          {/* サブタイトル */}
          <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
            {isEnglish
              ? <>In an AI-accelerating world, correct information matters.<br />Access only official documentation — no noise, no hallucinations.</>
              : <>AIが加速するこの時代だからこそ、正確な情報を。<br />公式ドキュメントのみを厳選し、ノイズのない情報源を提供します。</>
            }
          </p>
        </div>
      </section>

      {/* ── リスト ── */}
      <div className="flex-1">
        {isEnglish ? <UrlList_en /> : <UrlList_ja />}
      </div>

      {/* ── フッター ── */}
      <footer
        className="text-center py-6 text-xs"
        style={{ backgroundColor: "#0a0a0a", color: "#4b5563" }}
      >
        © 2025 DevDocs — {isEnglish ? "Official Documentation Hub" : "公式ドキュメント集"}
      </footer>

    </div>
  );
}