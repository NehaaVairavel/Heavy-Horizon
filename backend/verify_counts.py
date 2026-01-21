from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv("MONGO_URI")
print(f"Connecting to MongoDB: {uri.split('@')[1] if '@' in uri else 'Local/Hidden'}")

try:
    client = MongoClient(uri)
    db = client["heavyhorizon"]
    
    machines = db["machines"].count_documents({})
    parts = db["parts"].count_documents({})
    blogs = db["blogs"].count_documents({})
    enquiries = db["enquiries"].count_documents({})
    
    print("-" * 30)
    print(f"Machines: {machines}")
    print(f"Parts:    {parts}")
    print(f"Blogs:    {blogs}")
    print(f"Enquiries:{enquiries}")
    print("-" * 30)
    
except Exception as e:
    print(f"Error: {e}")
