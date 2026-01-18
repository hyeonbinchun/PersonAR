import motor.motor_asyncio
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client.personar

user_collection = database.get_collection("users")

async def create_vector_index():
    # Create a vector search index if it doesn't exist
    # This is an example, you might need to adjust it based on your MongoDB Atlas setup
    index_model = {
        "name": "vector_index",
        "definition": {
            "mappings": {
                "dynamic": True,
                "fields": [
                    {
                        "type": "vector",
                        "path": "face_vectors",
                        "numDimensions": 128,
                        "similarity": "cosine"
                    }
                ]
            }
        }
    }
    
    # list_search_indexes() is not a standard pymongo method.
    # This is a placeholder for the logic you would use with MongoDB Atlas.
    # You would typically use the Atlas Search API to create indexes.
    # For local development, you might not be able to create a vector search index.
    # We will assume the index is created manually or through another process for now.
    # For the purpose of this code, we will just print a message.
    print("Vector index creation is assumed to be handled by MongoDB Atlas.")