# ============================================================================
# ULTRON OS - TEXT-TO-SPEECH ENGINE
# File: backend/text_to_speech.py
# Purpose: Local pyttsx3 or online OpenAI TTS according to voice mode.
# ============================================================================

import logging
import os
import tempfile
import threading
from datetime import datetime

from online_service import synthesize_online_speech
from voice_mode import get_active_voice_mode

logger = logging.getLogger(__name__)

try:
    import winsound
    WINSOUND_AVAILABLE = True
except ImportError:
    winsound = None
    WINSOUND_AVAILABLE = False

import pyttsx3


class TextToSpeechEngine:
    """Speaks text locally or with online TTS."""

    def __init__(self):
        self.engine = None
        self.voices = []
        self.is_speaking = False
        self.current_text = None
        self.speech_thread = None
        self.processing_mode = None

        self._initialize_local_engine()

    def _initialize_local_engine(self):
        try:
            self.engine = pyttsx3.init()
            self.voices = self.engine.getProperty("voices") or []

            self.engine.setProperty("rate", 150)
            self.engine.setProperty("volume", 1.0)

            # Preserve the existing default voice selection.
            if self.voices:
                self.engine.setProperty("voice", self.voices[0].id)

            logger.info("Local TTS initialized with %d voices", len(self.voices))
        except Exception as exc:
            logger.error("Error initializing local TTS: %s", exc)
            self.engine = None
            self.voices = []

    def get_available_voices(self):
        return [
            {
                "id": idx,
                "name": voice.name,
                "languages": voice.languages
                if hasattr(voice, "languages")
                else [],
            }
            for idx, voice in enumerate(self.voices)
        ]

    def set_voice(self, voice_id):
        try:
            if not self.engine:
                return False

            voice_id = int(voice_id)
            if 0 <= voice_id < len(self.voices):
                self.engine.setProperty("voice", self.voices[voice_id].id)
                return True

            return False
        except Exception as exc:
            logger.error("Error setting local voice: %s", exc)
            return False

    def set_rate(self, rate):
        try:
            if not self.engine:
                return False

            rate = max(50, min(300, int(rate)))
            self.engine.setProperty("rate", rate)
            return True
        except Exception as exc:
            logger.error("Error setting rate: %s", exc)
            return False

    def set_volume(self, volume):
        try:
            if not self.engine:
                return False

            volume = max(0.0, min(1.0, float(volume)))
            self.engine.setProperty("volume", volume)
            return True
        except Exception as exc:
            logger.error("Error setting volume: %s", exc)
            return False

    def speak(self, text):
        if not text or not str(text).strip():
            return {
                "status": "error",
                "message": "No text provided",
                "timestamp": datetime.now().isoformat(),
            }

        mode = get_active_voice_mode()
        self.processing_mode = mode
        self.current_text = str(text)

        if mode == "online":
            return self._speak_online(self.current_text)

        return self._speak_local(self.current_text)

    def _speak_local(self, text):
        if not self.engine:
            return {
                "status": "error",
                "message": "Local TTS engine not initialized",
                "timestamp": datetime.now().isoformat(),
            }

        try:
            self.is_speaking = True
            self.engine.say(text)
            self.engine.runAndWait()

            return {
                "status": "success",
                "message": "Text spoken",
                "text_length": len(text),
                "mode": "offline",
                "timestamp": datetime.now().isoformat(),
            }
        except Exception as exc:
            logger.error("Local TTS error: %s", exc)
            return {
                "status": "error",
                "message": str(exc),
                "mode": "offline",
                "timestamp": datetime.now().isoformat(),
            }
        finally:
            self.is_speaking = False

    def _speak_online(self, text):
        if not WINSOUND_AVAILABLE:
            return {
                "status": "error",
                "message": "Online TTS playback currently requires Windows",
                "mode": "online",
                "timestamp": datetime.now().isoformat(),
            }

        audio_file = None

        try:
            self.is_speaking = True

            with tempfile.NamedTemporaryFile(
                prefix="ultron_tts_",
                suffix=".wav",
                delete=False,
            ) as temp_file:
                audio_file = temp_file.name

            result = synthesize_online_speech(text, audio_file)
            if result.get("status") != "success":
                return {
                    "status": "error",
                    "message": result.get("message", "Online TTS failed"),
                    "mode": "online",
                    "timestamp": datetime.now().isoformat(),
                }

            # This function runs in speak_async's worker thread, so synchronous
            # playback here does not block the Flask request.
            winsound.PlaySound(audio_file, winsound.SND_FILENAME)

            return {
                "status": "success",
                "message": "Online speech completed",
                "text_length": len(text),
                "mode": "online",
                "model": result.get("model"),
                "voice": result.get("voice"),
                "timestamp": datetime.now().isoformat(),
            }

        except Exception as exc:
            logger.error("Online TTS error: %s", exc)
            return {
                "status": "error",
                "message": str(exc),
                "mode": "online",
                "timestamp": datetime.now().isoformat(),
            }
        finally:
            self.is_speaking = False
            if audio_file and os.path.exists(audio_file):
                try:
                    os.remove(audio_file)
                except OSError:
                    logger.warning("Could not remove online TTS temporary file")

    def speak_async(self, text):
        if not text or not str(text).strip():
            return {
                "status": "error",
                "message": "No text provided",
                "timestamp": datetime.now().isoformat(),
            }

        if self.is_speaking:
            return {
                "status": "error",
                "message": "Already speaking",
                "timestamp": datetime.now().isoformat(),
            }

        self.speech_thread = threading.Thread(
            target=self.speak,
            args=(text,),
            daemon=True,
        )
        self.speech_thread.start()

        return {
            "status": "success",
            "message": "Text to speech started",
            "mode": get_active_voice_mode(),
            "timestamp": datetime.now().isoformat(),
        }

    def stop_speaking(self):
        try:
            if self.engine:
                self.engine.stop()

            if WINSOUND_AVAILABLE:
                winsound.PlaySound(None, winsound.SND_PURGE)

            self.is_speaking = False
            return True
        except Exception as exc:
            logger.error("Error stopping speech: %s", exc)
            return False

    def get_status(self):
        return {
            "is_speaking": self.is_speaking,
            "current_text": (
                self.current_text[:50] + "..."
                if self.current_text and len(self.current_text) > 50
                else self.current_text
            ),
            "mode": get_active_voice_mode(),
            "processing_mode": self.processing_mode,
            "rate": self.engine.getProperty("rate") if self.engine else 0,
            "volume": self.engine.getProperty("volume") if self.engine else 0,
            "available_voices": len(self.voices),
            "online_playback_available": WINSOUND_AVAILABLE,
            "timestamp": datetime.now().isoformat(),
        }


tts_engine = TextToSpeechEngine()


def speak_text(text):
    return tts_engine.speak(text)


def speak_text_async(text):
    return tts_engine.speak_async(text)


def stop_speaking():
    return tts_engine.stop_speaking()


def set_voice(voice_id):
    return tts_engine.set_voice(voice_id)


def set_speech_rate(rate):
    return tts_engine.set_rate(rate)


def set_volume(volume):
    return tts_engine.set_volume(volume)


def get_voices():
    return tts_engine.get_available_voices()


def get_tts_status():
    return tts_engine.get_status()
