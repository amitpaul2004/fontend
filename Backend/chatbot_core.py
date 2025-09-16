# chatbot_core.py
import os, json
from datetime import datetime, timezone
from dotenv import load_dotenv
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold   
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from security_filters import sanitize_user_input, validate_output

# ---- Load environment ----
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
SYSTEM_PROMPT = os.getenv("SYSTEM_PROMPT")

if not API_KEY or not SYSTEM_PROMPT:
    raise EnvironmentError("Missing GEMINI_API_KEY or SYSTEM_PROMPT in .env")

genai.configure(api_key=API_KEY)

# ---- Gemini model with proper safety settings ----
model = genai.GenerativeModel(
    "gemini-1.5-flash",
    system_instruction=SYSTEM_PROMPT,
    safety_settings=[
        {
            "category": HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            "category": HarmCategory.HARM_CATEGORY_HARASSMENT,
            "threshold": HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ],
)
chat = model.start_chat()

# ---- Load & embed knowledge base ----
def load_knowledge(path="knowledge/universitydata.txt"):
    with open(path, "r", encoding="utf-8") as f:
        text = f.read()
    return [chunk.strip() for chunk in text.split("\n") if chunk.strip()]

kb_chunks = load_knowledge()
embedder = SentenceTransformer("all-MiniLM-L6-v2")
kb_embeddings = embedder.encode(kb_chunks, convert_to_numpy=True)
index = faiss.IndexFlatL2(kb_embeddings.shape[1])
index.add(kb_embeddings)

def retrieve_relevant(query, k=3):
    q_emb = embedder.encode([query], convert_to_numpy=True)
    _, ids = index.search(q_emb, k)
    return [kb_chunks[i] for i in ids[0]]

# ---- Main chat function ----
def chat_with_bot(user_message: str, session_id="default") -> str:
    # Sanitize user input
    user_message = sanitize_user_input(user_message)

    # Retrieve context safely
    context_chunks = retrieve_relevant(user_message)
    if any("BEGIN PRIVATE KEY" in c for c in context_chunks):
        raise ValueError("Suspicious content in knowledge base.")
    context = "\n".join(context_chunks)

    # Send to model
    prompt = f"Context:\n{context}\n\nUser: {user_message}"
    reply = chat.send_message(prompt).text.strip()

    # Validate model output
    validate_output(reply)

    # Log conversation securely
    os.makedirs("chatlogs", exist_ok=True)
    log_path = os.path.join("chatlogs", f"{session_id}.json")
    entry = {
        "time": datetime.now(timezone.utc).isoformat(),
        "user": user_message,
        "bot": reply
    }
    history = []
    if os.path.exists(log_path):
        with open(log_path, "r", encoding="utf-8") as f:
            history = json.load(f)
    history.append(entry)
    with open(log_path, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)

    return reply
