# Lambda — URL Sync Function

Google スプレッドシートから URL データを読み込み、Firebase Firestore へ同期する AWS Lambda 関数です。  
EventBridge（旧 CloudWatch Events）で定期実行（Cron）します。

## 処理の流れ

1. AWS Secrets Manager から Firebase 認証情報と Google Sheets API キーを取得
2. Google Sheets API でスプレッドシート（`my_coll!A1:Z1000`）を取得
3. Firestore の `URL_Collect` コレクションを全件削除
4. スプレッドシートの行データを Firestore へ書き込み

## スプレッドシートのカラム構成

| 列 | フィールド |
|----|-----------|
| A  | name      |
| B  | url       |
| C  | category  |

## 必要な Secrets Manager シークレット

| シークレット名 | 内容 |
|---------------|------|
| `url-collection-firebase-secret` | Firebase Admin SDK の認証情報（JSON） |
| `google-sheet-secret` | `GOOGLE_API_KEY`, `SPREADSHEET_ID` |

## ローカル実行

```bash
cd lambda
uv sync          # 依存関係をインストール
uv run Url_Gather_lambda.py
```

> ローカル実行時は `url-collection-f6e8a-firebase-adminsdk-fbsvc-b2f6750911.json` を使用します。  
> Secrets Manager の代わりにローカルの認証情報ファイルを直接参照します。

## デプロイ

Lambda に zip をアップロードするか、AWS CLI / SAM / CDK でデプロイしてください。

```bash
pip install -r requirements.txt -t package/
cd package && zip -r ../lambda.zip . && cd ..
zip lambda.zip Url_Gather_lambda.py
aws lambda update-function-code --function-name <関数名> --zip-file fileb://lambda.zip
```
