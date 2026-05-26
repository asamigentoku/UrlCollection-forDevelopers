from dotenv import load_dotenv
import os
import requests

load_dotenv()

API_KEY        = os.getenv("GOOGLE_API_KEY")
SPREADSHEET_ID = os.getenv("SPREADSHEET_ID")
SHEET_RANGE    = "my_coll!A1:Z1000"

url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{SHEET_RANGE}"
rows = requests.get(url, params={"key": API_KEY}).json().get("values", [])

for row in rows:
    # 空白行や、データが足りない行をスキップする安全対策
    if len(row) < 3:
        continue

    # SQLのレコードを分解するように、各カラム（列）を変数に代入する
    name     = row[0]  # A列：名前
    category = row[1]  # B列：カテゴリ（mobile, ai など）
    url_data = row[2]  # C列：URL

    # 綺麗に出力して確認する
    print(f"【名前】: {name}")
    print(f"【カテゴリ】: {category}")
    print(f"【URL】: {url_data}")
    print("-" * 30) # 区切り線