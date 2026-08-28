# ============================================================================
# ULTRON OS - AI ENGINE
# File: backend/ai_engine.py
# Purpose: Route commands to local or online AI according to voice mode.
# ============================================================================

import logging
from datetime import datetime

from ollama_service import generate_ollama_response, chat_with_ollama, get_ollama_status
from voice_mode import get_active_voice_mode, get_voice_mode_status
from online_service import generate_online_response, get_online_status

logger = logging.getLogger(__name__)


class AIEngine:
    """
    Central AI router.

    Local/offline mode -> Ollama
    Online mode       -> OpenAI Responses API
    Auto mode         -> selected by VoiceModeManager
    """

    def __init__(self):
        self.engine_name = "ULTRON OS AI Engine v2.0"
        self.is_active = True
        self.command_history = []
        self.max_history = 100
        self.system_prompt = (
            "You are ULTRON, a desktop AI assistant. "
            "Be concise, useful, and direct. "
            "When the user asks for a computer action, describe the intended action "
            "clearly; actual system execution remains handled by ULTRON's command router."
        )

        logger.info("AI Engine initialized")

    def process_command(self, command, params=None):
        params = params or {}
        command = str(command or "").strip()

        if not command:
            return {
                "status": "error",
                "message": "No command provided",
                "timestamp": datetime.now().isoformat(),
            }

        try:
            command_lower = command.lower()
            mode = get_active_voice_mode()

            logger.info("Processing command in %s mode: %s", mode, command)

            self._add_to_history({
                "command": command,
                "mode": mode,
                "timestamp": datetime.now().isoformat(),
                "status": "processed",
            })

            # Keep deterministic local utility commands local.
            if self._is_status_request(command_lower):
                response = self._handle_status_request()
                source = "local"
            elif self._is_time_request(command_lower):
                response = self._handle_time_request()
                source = "local"
            elif self._is_help_request(command_lower):
                response = self._handle_help_request()
                source = "local"
            elif self._is_greeting(command_lower):
                response = self._handle_greeting(command_lower)
                source = "local"
            else:
                result = self._generate_ai_response(command, params, mode)
                if result["status"] != "success":
                    return {
                        "status": "error",
                        "command": command,
                        "mode": mode,
                        "source": result.get("source"),
                        "error": result.get("message", "AI request failed"),
                        "timestamp": datetime.now().isoformat(),
                        "engine": self.engine_name,
                    }
                response = result["response"]
                source = result.get("source", mode)

            return {
                "status": "success",
                "command": command,
                "response": response,
                "mode": mode,
                "source": source,
                "timestamp": datetime.now().isoformat(),
                "engine": self.engine_name,
            }

        except Exception as exc:
            logger.exception("Error processing command")
            return {
                "status": "error",
                "command": command,
                "error": str(exc),
                "timestamp": datetime.now().isoformat(),
                "engine": self.engine_name,
            }

    def _generate_ai_response(self, command, params, mode):
        messages = params.get("messages")

        if mode == "online":
            return generate_online_response(
                command,
                system_prompt=params.get("system_prompt", self.system_prompt),
                messages=messages,
            )

        # Offline mode uses the existing Ollama service.
        if messages:
            return chat_with_ollama(
                messages,
                system_prompt=params.get("system_prompt", self.system_prompt),
            )

        return generate_ollama_response(
            f"{self.system_prompt}\n\nUser: {command}\nULTRON:"
        )

    def _is_greeting(self, command):
        greetings = ["hello", "hi", "hey", "greetings", "what's up"]
        return any(
            command == greeting or command.startswith(greeting + " ")
            for greeting in greetings
        )

    def _handle_greeting(self, command):
        return "Hello. I'm ULTRON. How can I help you?"

    def _is_status_request(self, command):
        keywords = ["status", "how are you", "are you alive", "system status"]
        return any(keyword in command for keyword in keywords)

    def _handle_status_request(self):
        return {
            "system": "ONLINE",
            "ai_engine": "ACTIVE",
            "voice_mode": get_voice_mode_status(),
            "online_service": get_online_status(),
            "ollama": get_ollama_status(),
        }

    def _is_help_request(self, command):
        keywords = ["help", "commands", "what can you do", "capabilities"]
        return any(keyword in command for keyword in keywords)

    def _handle_help_request(self):
        return {
            "available_commands": [
                "hello - Greet ULTRON",
                "status - Get system status",
                "help - Show capabilities",
                "time - Get current time",
                "natural language - Send to the active AI provider",
            ],
            "voice_modes": ["offline", "online", "auto"],
        }

    def _is_time_request(self, command):
        keywords = ["time", "what time", "current time", "what's the time"]
        return any(keyword in command for keyword in keywords)

    def _handle_time_request(self):
        now = datetime.now()
        return {
            "time": now.strftime("%H:%M:%S"),
            "date": now.strftime("%Y-%m-%d"),
            "timezone": "System Local",
            "formatted": now.strftime("%A, %B %d, %Y at %I:%M %p"),
        }

    def _add_to_history(self, entry):
        self.command_history.append(entry)
        if len(self.command_history) > self.max_history:
            self.command_history.pop(0)

    def get_history(self, limit=10):
        try:
            limit = max(1, int(limit))
        except (TypeError, ValueError):
            limit = 10
        return self.command_history[-limit:]

    def clear_history(self):
        self.command_history = []
        logger.info("Command history cleared")

    def get_status(self):
        return {
            "engine": self.engine_name,
            "status": "ACTIVE" if self.is_active else "INACTIVE",
            "active_voice_mode": get_active_voice_mode(),
            "history_count": len(self.command_history),
            "timestamp": datetime.now().isoformat(),
        }


ai_engine = AIEngine()


def process_ai_command(command, params=None):
    return ai_engine.process_command(command, params)


def get_ai_status():
    return ai_engine.get_status()


def get_command_history(limit=10):
    return ai_engine.get_history(limit)


def clear_command_history():
    ai_engine.clear_history()
    return {"status": "success", "message": "History cleared"}
