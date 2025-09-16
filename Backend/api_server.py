# api_server.py
from flask import Flask, request, jsonify
from flask_cors import CORS  
from chatbot_core import chat_with_bot

app = Flask(__name__)
CORS(app)

@app.route("/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json(force=True)
    user_message = data.get("message", "").strip()
    session_id = data.get("session_id", "default")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    reply = chat_with_bot(user_message, session_id=session_id)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
