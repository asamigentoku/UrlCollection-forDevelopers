# front-react — URL Collection Frontend

Next.js (App Router) で構築された、開発者向け公式ドキュメント集のフロントエンドです。

## 機能

- **JA / EN 言語切り替え** — ヘッダーのトグルで全 UI を日本語/英語に切り替え
- **公式ドキュメント一覧** — Firebase Firestore からデータを取得してカテゴリ/検索フィルタで表示
- **Qiita トレンド** — Qiita API から最新記事を取得して表示

## ディレクトリ構成

```
app/
├── components/
│   ├── QiitaFeed.tsx     # Qiita トレンドタブ（isEnglish prop で言語切り替え）
│   ├── UrlList_en.tsx    # 英語版 URL 一覧
│   └── UrlList_ja.tsx    # 日本語版 URL 一覧
├── hooks/
│   └── fetchData.ts      # Firestore からデータ取得するカスタムフック
├── lib/
│   └── firebase.ts       # Firebase 初期化
├── types/
│   ├── qiita_type.ts
│   └── urls_type.ts
├── layout.tsx
├── page.tsx              # メインページ（タブ・言語トグル管理）
└── providers.tsx         # React Query Provider
```

## 環境変数

`.env.local` に以下を設定してください：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## ローカル開発

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) で確認できます。

## ビルド & 静的エクスポート

```bash
npm run build
```

`out/` ディレクトリに静的ファイルが生成されます。  
AWS CloudFront + S3 にそのままデプロイできます。
