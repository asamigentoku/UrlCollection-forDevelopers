from dotenv import load_dotenv
import os
import requests
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('url-collection-f6e8a-firebase-adminsdk-fbsvc-b2f6750911.json')
app = firebase_admin.initialize_app(cred)

db = firestore.client()
ref = db.collection('URL_Collect')


load_dotenv()

API_KEY        = os.getenv("GOOGLE_API_KEY")
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")
SHEET_RANGE    = "my_coll!A1:Z1000"

url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{SHEET_RANGE}"
rows = requests.get(url, params={"key": API_KEY}).json().get("values", [])

def delete_collection(col_ref, batch_size=500):
    """
    Firestoreのコレクションを全件削除する。
    500件ごとにバッチ処理するので、大量データでも安全。
    """
    deleted = 0
    while True:
        docs = list(col_ref.limit(batch_size).stream())
        if not docs:
            break
        batch = db.batch()
        for doc in docs:
            batch.delete(doc.reference)
        batch.commit()
        deleted += len(docs)
        print(f"  {deleted} 件削除済み...")

# ── 実行前にコレクションをクリア ───────────────────────────────────────────
print("既存データを削除中...")
delete_collection(ref)

for row in rows[1:]:
    # 空白行や、データが足りない行をスキップする安全対策
    if len(row) < 3:
        continue

    # SQLのレコードを分解するように、各カラム（列）を変数に代入する
    name     = row[0]  # A列：名前
    url = row[1]  # B列：カテゴリ（mobile, ai など）
    category = row[2]  # C列：URL
    data = {
        "name": name,
        "category": category,
        "url": url,  # サーバー時間のタイムスタンプ（任意）
    }

    # 【ここが書き込み処理】
    # add() を使うと、ドキュメントID（主キー）がランダムで自動生成されてINSERTされます
    doc_ref = ref.add(data)
print("すべてのデータをfirebaseに書き込みました")

