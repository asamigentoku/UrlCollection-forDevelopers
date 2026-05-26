import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('url-collection-f6e8a-firebase-adminsdk-fbsvc-b2f6750911.json')
app = firebase_admin.initialize_app(cred)

db = firestore.client()
ref = db.collection('URL_Collect')
docs = ref.stream()

for doc in docs:
    print(u'{} => {}'.format(doc.id, doc.to_dict()))