import os
import json
import boto3
import urllib.request
import urllib.parse
import firebase_admin
from firebase_admin import credentials,firestore

def get_firebase_cert():
    client = boto3.client("secretsmanager", region_name="ap-northeast-1")
    secret = client.get_secret_value(SecretId="url-collection-firebase-secret")
    return json.loads(secret["SecretString"])

def create_firebase_client(cred):
    if not firebase_admin._apps:  # 初期化済みかチェック
        firebase_admin.initialize_app(cred)
    firebase_db = firestore.client()
    return firebase_db

def load_sheet():
    API_KEY = os.environ.get('GOOGLE_API_KEY')
    SPREADSHEET_ID = os.environ.get("SPREADSHEET_ID")
    SHEET_RANGE    = "my_coll!A1:Z1000"
    params = urllib.parse.urlencode({"key": API_KEY})
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{SHEET_RANGE}?{params}"
    try:
        with urllib.request.urlopen(url) as res:
            body = json.loads(res.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(e.read().decode("utf-8"))
        # 詳細エラーを表示
        raise
    return body.get("values", [])

def delete_collection(db_client,col_ref, batch_size=500):
    """
    Firestoreのコレクションを全件削除する。
    500件ごとにバッチ処理するので、大量データでも安全。
    """
    deleted = 0
    while True:
        docs = list(col_ref.limit(batch_size).stream())
        if not docs:
            break
        batch = db_client.batch()
        for doc in docs:
            batch.delete(doc.reference)
        batch.commit()
        deleted += len(docs)
        print(f"  {deleted} 件削除済み...")

def write_firebase(ref,rows):
    for row in rows[1:]:
        # 空白行や、データが足りない行をスキップする安全対策
        if len(row) < 3:
            continue
        # SQLのレコードを分解するように、各カラム（列）を変数に代入する
        name     = row[0]  # A列：名前
        url = row[1]  # B列：カテゴリ（mobile, ai など）
        category = row[2]# C列：URL
        # logo = row[3]
        data = {
            "name": name,
            "category": category,
            "url": url,
            # "logo": logo,
            # サーバー時間のタイムスタンプ（任意）
        }

        # 【ここが書き込み処理】
        # add() を使うと、ドキュメントID（主キー）がランダムで自動生成されてINSERTされます
        doc_ref = ref.add(data)
    print("すべてのデータをfirebaseに書き込みました")

def lambda_handler(event, context):
    cred_dict = get_firebase_cert()
    cred = credentials.Certificate(cred_dict)
    database= create_firebase_client(cred)
    table_name= database.collection('URL_Collect')
    datas = load_sheet()
    delete_collection(database, table_name)
    write_firebase(table_name, datas)
    return {"statusCode": 200, "body": "完了"}

if __name__ == "__main__":
    cred = credentials.Certificate('url-collection-f6e8a-firebase-adminsdk-fbsvc-b2f6750911.json')
    db=create_firebase_client(cred)
    ref = db.collection('URL_Collect')
    rows = load_sheet()
    delete_collection(db,ref)
    write_firebase(ref,rows)

