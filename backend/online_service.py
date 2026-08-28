# ============================================================================
# ULTRON OS - ONLINE AI / STT / TTS SERVICE
# File: backend/online_service.py
# Purpose: Online voice and AI processing through the OpenAI API.
# ============================================================================

import logging
import os
import tempfile
import time
from datetime import datetime

import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class OnlineService:
    """
    OpenAI API adapter used by ULTRON's online voice mode.

    API key is read from OPENAI_API_KEY in backend/.env.
    Models are configurable through environment variables.
    """

    BASE_URL = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1").rstrip("/")

    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "").strip()
        self.ai_model = os.getenv("OPENAI_MODEL", "gpt-5.6-luna").strip()
        self.stt_model = os.getenv("OPENAI_STT_MODEL", "gpt-transcribe").strip()
        self.tts_model = os.getenv("OPENAI_TTS_MODEL", "gpt-4o-mini-tts").strip()
        self.tts_voice = os.getenv("OPENAI_TTS_VOICE", "onyx").strip()
        self.timeout = int(os.getenv("OPENAI_TIMEOUT", "120"))

        self.last_ai_response_time = 0.0
        self.last_stt_response_time = 0.0
        self.last_tts_response_time = 0.0

    def _configured(self):
        return bool(self.api_key) and self.api_key.lower() not in {
            "your_key_here",
            "your-api-key",
        }

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
        }

    def get_status(self):
        return {
            "configured": self._configured(),
            "base_url": self.BASE_URL,
            "ai_model": self.ai_model,
            "stt_model": self.stt_model,
            "tts_model": self.tts_model,
            "tts_voice": self.tts_voice,
            "timestamp": datetime.now().isoformat(),
        }

    def generate_response(self, prompt, system_prompt=None, messages=None):
        """Generate an online text response using the Responses API."""
        if not self._configured():
            return {
                "status": "error",
                "message": "OPENAI_API_KEY is not configured",
                "response": None,
                "source": "openai",
            }

        if not prompt and not messages:
            return {
                "status": "error",
                "message": "No prompt provided",
                "response": None,
                "source": "openai",
            }

        if messages:
            input_items = []
            if system_prompt:
                input_items.append({
                    "role": "developer",
                    "content": system_prompt,
                })
            for message in messages:
                role = message.get("role", "user")
                if role == "system":
                    role = "developer"
                input_items.append({
                    "role": role,
                    "content": message.get("content", ""),
                })
        else:
            input_items = []
            if system_prompt:
                input_items.append({
                    "role": "developer",
                    "content": system_prompt,
                })
            input_items.append({
                "role": "user",
                "content": prompt,
            })

        payload = {
            "model": self.ai_model,
            "input": input_items,
        }

        start = time.perf_counter()
        try:
            response = requests.post(
                f"{self.BASE_URL}/responses",
                headers={
                    **self._headers(),
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=self.timeout,
            )
            self.last_ai_response_time = time.perf_counter() - start

            if response.status_code != 200:
                message = self._error_message(response)
                logger.error("OpenAI AI request failed: %s", message)
                return {
                    "status": "error",
                    "message": message,
                    "response": None,
                    "source": "openai",
                    "response_time": self.last_ai_response_time,
                }

            data = response.json()
            text = self._extract_output_text(data).strip()

            return {
                "status": "success",
                "response": text,
                "model": self.ai_model,
                "response_time": self.last_ai_response_time,
                "source": "openai",
                "timestamp": datetime.now().isoformat(),
            }

        except requests.Timeout:
            logger.error("OpenAI AI request timed out")
            return {
                "status": "error",
                "message": "Online AI request timed out",
                "response": None,
                "source": "openai",
            }
        except requests.RequestException as exc:
            logger.error("OpenAI AI network error: %s", exc)
            return {
                "status": "error",
                "message": str(exc),
                "response": None,
                "source": "openai",
            }
        except Exception as exc:
            logger.exception("Unexpected OpenAI AI error")
            return {
                "status": "error",
                "message": str(exc),
                "response": None,
                "source": "openai",
            }

    @staticmethod
    def _extract_output_text(data):
        if data.get("output_text"):
            return data["output_text"]

        parts = []
        for item in data.get("output", []):
            for content in item.get("content", []):
                text = content.get("text")
                if text:
                    parts.append(text)

        return "\n".join(parts)

    def transcribe_audio(self, audio_file):
        """Transcribe a WAV/audio file with the online transcription API."""
        if not self._configured():
            return {
                "status": "error",
                "message": "OPENAI_API_KEY is not configured",
                "transcript": "",
                "source": "openai",
            }

        if not audio_file or not os.path.exists(audio_file):
            return {
                "status": "error",
                "message": "Audio file does not exist",
                "transcript": "",
                "source": "openai",
            }

        start = time.perf_counter()
        try:
            with open(audio_file, "rb") as audio:
                response = requests.post(
                    f"{self.BASE_URL}/audio/transcriptions",
                    headers=self._headers(),
                    files={
                        "file": (
                            os.path.basename(audio_file),
                            audio,
                            "audio/wav",
                        )
                    },
                    data={
                        "model": self.stt_model,
                        "language": "en",
                    },
                    timeout=self.timeout,
                )

            self.last_stt_response_time = time.perf_counter() - start

            if response.status_code != 200:
                message = self._error_message(response)
                logger.error("Online STT failed: %s", message)
                return {
                    "status": "error",
                    "message": message,
                    "transcript": "",
                    "source": "openai",
                }

            data = response.json()
            transcript = data.get("text", "").strip()

            return {
                "status": "success",
                "transcript": transcript,
                "model": self.stt_model,
                "response_time": self.last_stt_response_time,
                "source": "openai",
                "timestamp": datetime.now().isoformat(),
            }

        except requests.Timeout:
            return {
                "status": "error",
                "message": "Online STT request timed out",
                "transcript": "",
                "source": "openai",
            }
        except requests.RequestException as exc:
            logger.error("Online STT network error: %s", exc)
            return {
                "status": "error",
                "message": str(exc),
                "transcript": "",
                "source": "openai",
            }
        except Exception as exc:
            logger.exception("Unexpected online STT error")
            return {
                "status": "error",
                "message": str(exc),
                "transcript": "",
                "source": "openai",
            }

    def synthesize_speech(self, text, output_file):
        """Generate WAV speech and save it locally for playback."""
        if not self._configured():
            return {
                "status": "error",
                "message": "OPENAI_API_KEY is not configured",
                "audio_file": None,
                "source": "openai",
            }

        if not text or not text.strip():
            return {
                "status": "error",
                "message": "No text provided",
                "audio_file": None,
                "source": "openai",
            }

        payload = {
            "model": self.tts_model,
            "voice": self.tts_voice,
            "input": text,
            "response_format": "wav",
        }

        start = time.perf_counter()
        try:
            response = requests.post(
                f"{self.BASE_URL}/audio/speech",
                headers={
                    **self._headers(),
                    "Content-Type": "application/json",
                },
                json=payload,
                timeout=self.timeout,
            )
            self.last_tts_response_time = time.perf_counter() - start

            if response.status_code != 200:
                message = self._error_message(response)
                logger.error("Online TTS failed: %s", message)
                return {
                    "status": "error",
                    "message": message,
                    "audio_file": None,
                    "source": "openai",
                }

            with open(output_file, "wb") as audio:
                audio.write(response.content)

            return {
                "status": "success",
                "audio_file": output_file,
                "model": self.tts_model,
                "voice": self.tts_voice,
                "response_time": self.last_tts_response_time,
                "source": "openai",
                "timestamp": datetime.now().isoformat(),
            }

        except requests.Timeout:
            return {
                "status": "error",
                "message": "Online TTS request timed out",
                "audio_file": None,
                "source": "openai",
            }
        except requests.RequestException as exc:
            logger.error("Online TTS network error: %s", exc)
            return {
                "status": "error",
                "message": str(exc),
                "audio_file": None,
                "source": "openai",
            }
        except Exception as exc:
            logger.exception("Unexpected online TTS error")
            return {
                "status": "error",
                "message": str(exc),
                "audio_file": None,
                "source": "openai",
            }

    @staticmethod
    def _error_message(response):
        try:
            data = response.json()
            error = data.get("error", {})
            if isinstance(error, dict):
                return error.get("message") or str(error)
            return str(error)
        except ValueError:
            return f"HTTP {response.status_code}: {response.text[:300]}"


online_service = OnlineService()


def get_online_status():
    return online_service.get_status()


def generate_online_response(prompt, system_prompt=None, messages=None):
    return online_service.generate_response(prompt, system_prompt, messages)


def transcribe_online_audio(audio_file):
    return online_service.transcribe_audio(audio_file)


def synthesize_online_speech(text, output_file):
    return online_service.synthesize_speech(text, output_file)
