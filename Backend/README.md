# Multilingual Chatbot Project

## Overview
This project is a multilingual chatbot system designed to interact with users in multiple languages, providing intelligent responses and integrating with platforms such as Telegram. It features a modular architecture for easy extension and customization, and includes security filters to ensure safe interactions.

## Features
- Multilingual support for user queries and responses
- Integration with Telegram via a bot
- API server for external integrations
- Security filters to block unsafe or inappropriate content
- Persistent chat logs and knowledge base
- Easy configuration via environment variables and config files

## Project Structure
```
api_server.py           # REST API server for chatbot
chatbot_core.py         # Main chatbot logic and language handling
security_filters.py     # Security and content filtering
telegram_bot.py         # Telegram bot integration
requirements.txt        # Python dependencies
.env                    # Environment variables (not tracked in git)
chatlogs/               # Directory for chat logs
knowledge/              # Knowledge base files
```

## Setup Instructions
1. **Clone the repository:**
   ```powershell
   git clone https://github.com/ArnavAdhikary05/multilingual_chatbot_project.git
   cd multilingual_chatbot_project
   ```
2. **Create and configure `.env` file:**
   - Add your API keys, bot tokens, and other secrets to `.env`.
3. **Install dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```
4. **Run the API server:**
   ```powershell
   python api_server.py
   ```
5. **Start the Telegram bot:**
   ```powershell
   python telegram_bot.py
   ```

## Usage
- Interact with the chatbot via the API or Telegram.
- Chat logs are stored in the `chatlogs/` directory.
- Knowledge base files are in `knowledge/`.

## Security
- Sensitive files (e.g., `.env`, keys, credentials) are ignored via `.gitignore`.
- Security filters are implemented in `security_filters.py` to block unsafe content.

## Contributing
1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Submit a pull request with a clear description


## Contact
For questions or support, contact the repository owner via GitHub.
