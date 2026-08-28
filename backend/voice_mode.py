# ============================================================================
# ULTRON OS - VOICE MODE MANAGER
# File: backend/voice_mode.py
# Purpose: Select offline, online, or automatic voice processing.
# ============================================================================

import logging
import os
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

VALID_MODES = {"offline", "online", "auto"}


class VoiceModeManager:
    """
    Controls which STT, AI, and TTS providers ULTRON uses.

    offline -> local Whisper + Ollama + pyttsx3
    online  -> OpenAI online STT + AI + TTS
    auto    -> online when an API key is configured, otherwise offline
    """

    def __init__(self):
        configured = os.getenv("ULTRON_VOICE_MODE", "auto").strip().lower()
        self.mode = configured if configured in VALID_MODES else "auto"
        if configured not in VALID_MODES:
            logger.warning("Invalid ULTRON_VOICE_MODE '%s'; using auto", configured)

    def set_mode(self, mode):
        mode = str(mode or "").strip().lower()
        if mode not in VALID_MODES:
            raise ValueError("Voice mode must be one of: offline, online, auto")

        self.mode = mode
        logger.info("Voice mode changed to: %s", mode)
        return self.get_status()

    def get_mode(self):
        return self.mode

    def online_configured(self):
        key = os.getenv("OPENAI_API_KEY", "").strip()
        return bool(key) and key.lower() not in {"your_key_here", "your-api-key"}

    def get_active_mode(self):
        if self.mode == "auto":
            return "online" if self.online_configured() else "offline"
        return self.mode

    def get_status(self):
        active = self.get_active_mode()
        return {
            "mode": self.mode,
            "active_mode": active,
            "online_configured": self.online_configured(),
            "offline_available": True,
            "timestamp": datetime.now().isoformat(),
        }


voice_mode_manager = VoiceModeManager()


def set_voice_mode(mode):
    return voice_mode_manager.set_mode(mode)


def get_voice_mode():
    return voice_mode_manager.get_mode()


def get_active_voice_mode():
    return voice_mode_manager.get_active_mode()


def get_voice_mode_status():
    return voice_mode_manager.get_status()
