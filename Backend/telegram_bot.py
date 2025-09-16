import os
import logging
import requests
from dotenv import load_dotenv      
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters, ContextTypes

# ------------------------------------------------------------
#  Load environment variables from .env
# ------------------------------------------------------------
load_dotenv()   # <-- loads variables from the .env file

# ------------------------------------------------------------
#  Configuration
# ------------------------------------------------------------
TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
API_URL = os.getenv("CHATBOT_API_URL", "http://localhost:5000/chat")

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)

# ------------------------------------------------------------
#  Handlers
# ------------------------------------------------------------
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("👋 Hi! I'm Unibot. your multilingual chatbot. Type anything to begin.")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_text = update.message.text

    try:
        resp = requests.post(API_URL, json={
            "message": user_text,
            "session_id": str(update.effective_user.id)
        }, timeout=20)

        if resp.ok:
            bot_reply = resp.json().get("reply", "(no reply)")
        else:
            bot_reply = f"API error: {resp.status_code}"
    except Exception as e:
        bot_reply = f"Error contacting chatbot: {e}"

    await update.message.reply_text(bot_reply)

# ------------------------------------------------------------
#  Main entry
# ------------------------------------------------------------
def main():
    if not TELEGRAM_TOKEN:
        raise RuntimeError("Missing TELEGRAM_BOT_TOKEN in .env or environment.")

    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    logging.info("Telegram bot is running...")
    app.run_polling()

if __name__ == "__main__":
    main()
