@AGENTS.md

## プロジェクト概要

Next.js (App Router) + TypeScript + Tailwind CSS で構築された静的サイトです。  
Firebase Firestore からデータを取得し、AWS CloudFront + S3 にデプロイしています。

## 言語切り替えの仕組み

- `page.tsx` の `isEnglish: boolean` ステートがすべてのタブ共通で言語を制御します
- `UrlList_ja.tsx` / `UrlList_en.tsx` は別コンポーネントとして分離されています
- `QiitaFeed.tsx` は `isEnglish` prop を受け取って UI テキストを切り替えます

## 開発コマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # 静的エクスポート（out/ に出力）
npm run lint   # ESLint
```

## 注意事項

- `app/lib/firebase.ts` の Firebase 設定は `NEXT_PUBLIC_*` 環境変数から読み込みます
- `next.config.ts` で `output: "export"` を設定しているため、サーバーサイド機能は使用できません
