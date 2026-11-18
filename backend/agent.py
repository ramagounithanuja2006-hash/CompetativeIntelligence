import os
from dotenv import load_dotenv
from groq import Groq

from hindsight import (
    retain_memory,
    recall_memory,
    reflect_memory
)

load_dotenv()

groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "openai/gpt-oss-120b"


async def analyze_competitor_data(company, source, content):

    prompt = f"""
You are a Competitive Intelligence Agent.

Analyze this competitor information.

Company:
{company}

Source:
{source}

Information:
{content}

Identify important events such as:
- Product
- Pricing
- Marketing
- Hiring
- Strategy

Return a concise analysis.
"""

    response = groq.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "system",
                "content": "You are a competitive intelligence analyst."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        max_completion_tokens=700
    )

    analysis = response.choices[0].message.content

    memory = (
        f"Competitor: {company}\n"
        f"Source: {source}\n"
        f"Observation: {content}\n"
        f"AI Analysis: {analysis}"
    )

    await retain_memory(
        memory,
        {
            "company": company,
            "source": source
        }
    )

    return {
        "company": company,
        "source": source,
        "analysis": analysis
    }


async def ask_agent(question):

    memories = await recall_memory(question)

    reflection = await reflect_memory(
        f"""
Question:
{question}

Use the competitor memories available in Hindsight.

Connect older and newer observations when relevant.

Identify:
- Changes
- Patterns
- Possible signals

Clearly distinguish stored evidence from interpretation.
"""
    )

    return {
        "question": question,
        "memories": memories,
        "answer": reflection["answer"],
        "based_on": reflection["based_on"]
    }