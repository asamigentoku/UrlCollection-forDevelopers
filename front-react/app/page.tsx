"use client"
import UrlList_ja from "@/app/components/UrlList_ja";
import UrlList_en from "@/app/components/UrlList_en";
import QiitaFeed from "@/app/components/QiitaFeed";
import { useState } from "react";

type Tab = "home" | "trend";

export default function Home() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const navItems: { id: Tab; label: string }[] = [
    { id: "home",  label: isEnglish ? "Docs" : "ドキュメント" },
    { id: "trend", label: "Trend" },
  ];

  return (
      <div className="min-h-screen flex flex-col" style={{backgroundColor: "#ffffff"}}>

          {/* ── ナビゲーションヘッダー ── */}
          <header
              className="flex items-center justify-between px-8 py-4"
              style={{backgroundColor: "#0a0a0a"}}
          >
              {/* 左上メニュー */}
              <nav className="flex items-center gap-1">
                  {navItems.map((item) => (
                      <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                          style={activeTab === item.id
                              ? { backgroundColor: "#ffffff", color: "#0a0a0a" }
                              : { backgroundColor: "transparent", color: "#9ca3af" }
                          }
                      >
                          {item.label}
                      </button>
                  ))}
              </nav>

              {/* 言語トグル（ホームのみ表示） */}
              {activeTab === "home" && (
                  <div
                      className="flex items-center rounded-full p-1 gap-1"
                      style={{backgroundColor: "#1f1f1f"}}
                  >
                      <button
                          onClick={() => setIsEnglish(false)}
                          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                          style={!isEnglish
                              ? {backgroundColor: "#ffffff", color: "#0a0a0a"}
                              : {backgroundColor: "transparent", color: "#6b7280"}
                          }
                      >
                          JA
                      </button>
                      <button
                          onClick={() => setIsEnglish(true)}
                          className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                          style={isEnglish
                              ? {backgroundColor: "#ffffff", color: "#0a0a0a"}
                              : {backgroundColor: "transparent", color: "#6b7280"}
                          }
                      >
                          EN
                      </button>
                  </div>
              )}
          </header>

          {/* ── ヒーローセクション（ホームのみ） ── */}
          {activeTab === "home" && (
              <section
                  className="px-8 py-10 text-center relative"
                  style={{backgroundImage: "url('/program.jpg')", backgroundSize: "cover", backgroundPosition: "center"}}
              >
                  <div className="absolute inset-0" style={{backgroundColor: "rgba(0,0,0,0.55)"}}/>
                  <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-3">
                      <span
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                          style={{backgroundColor: "#172554", color: "#93c5fd", border: "1px solid #1e40af"}}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                clipRule="evenodd"/>
                        </svg>
                          {isEnglish ? "Official sources only" : "公式ソースのみ厳選"}
                      </span>
                      <h1 className="text-2xl font-bold text-white leading-snug">
                          {isEnglish
                              ? <>Official Documentation for Engineers Worldwide</>
                              : <>全世界のエンジニアのための公式ドキュメント集</>
                          }
                      </h1>
                      <p className="text-sm leading-relaxed" style={{color: "#94a3b8"}}>
                          {isEnglish
                              ? <>In an AI-accelerating world, correct information matters.<br/>Access only official
                                  documentation — no noise, no hallucinations.</>
                              : <>AIが加速するこの時代だからこそ、正確な情報を。<br/>公式ドキュメントのみを厳選し、ノイズのない情報源を提供します。</>
                          }
                      </p>
                  </div>
              </section>
          )}

          {/* ── メインコンテンツ ── */}
          <div className="flex-1">
              {activeTab === "home"  && (isEnglish ? <UrlList_en /> : <UrlList_ja />)}
              {activeTab === "trend" && <QiitaFeed />}
          </div>

          {/* ── フッター ── */}
          <footer
              className="flex flex-col items-center py-6 text-xs gap-3"
              style={{backgroundColor: "#0a0a0a", color: "#4b5563"}}
          >
              <a href="https://px.a8.net/svt/ejp?a8mat=4B5RSB+AEHOAA+50+2HV61T" rel="nofollow">
                  <img style={{border: 0}} width="728" height="90" alt=""
                       src="https://www28.a8.net/svt/bgt?aid=260609771629&wid=001&eno=01&mid=s00000000018015094000&mc=1"/></a>
              <img style={{border: 0}} width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=4B5RSB+AEHOAA+50+2HV61T" alt=""/>
              © 2025 DevDocs — {isEnglish ? "Official Documentation Hub" : "公式ドキュメント集"}
          </footer>

      </div>
  );
}
