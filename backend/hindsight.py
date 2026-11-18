import os
from dotenv import load_dotenv
from hindsight_client import Hindsight

load_dotenv()

BASE_URL = os.getenv(
    "HINDSIGHT_BASE_URL",
    "https://api.hindsight.vectorize.io"
)

API_KEY = os.getenv("HINDSIGHT_API_KEY")

BANK_ID = os.getenv(
    "HINDSIGHT_BANK_ID",
    "competitive-intelligence"
)

client = Hindsight(
    base_url=BASE_URL,
    api_key=API_KEY
)


async def setup_memory():
    try:
        await client.acreate_bank(
            bank_id=BANK_ID,
            name="Competitive Intelligence Memory",
            background=(
                "Memory bank for competitor activity, pricing, "
                "products, marketing, hiring and strategic changes."
            )
        )
        print("Hindsight memory bank ready.")
    except Exception as e:
        print(f"Hindsight bank setup: {e}")


async def retain_memory(content, metadata=None):
    return await client.aretain(
        bank_id=BANK_ID,
        content=content,
        metadata=metadata or {}
    )


async def recall_memory(query):
    result = await client.arecall(
        bank_id=BANK_ID,
        query=query,
        max_tokens=3000,
        budget="mid"
    )

    return [
        {
            "text": memory.text,
            "type": memory.type
        }
        for memory in result.results
    ]


async def reflect_memory(query):
    result = await client.areflect(
        bank_id=BANK_ID,
        query=query,
        budget="mid"
    )

    return {
        "answer": result.text,
        "based_on": getattr(result, "based_on", [])
    }