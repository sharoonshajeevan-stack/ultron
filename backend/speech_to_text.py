# ============================================================================
# ULTRON OS - SPEECH-TO-TEXT ENGINE
# File: backend/speech_to_text.py
# Purpose: Local Whisper or online STT according to voice mode.
# ============================================================================

import logging
import os
import threading
import wave
from datetime import datetime

import numpy as np
import pyaudio

from online_service import transcribe_online_audio
from voice_mode import get_active_voice_mode

logger = logging.getLogger(__name__)

try:
    import whisper
    WHISPER_AVAILABLE = True
except ImportError:
    WHISPER_AVAILABLE = False
    logger.warning("Whisper not available - install with: pip install openai-whisper")


class SpeechToTextEngine:
    """Records microphone audio and transcribes it locally or online."""

    def __init__(self):
        self.is_recording = False
        self.audio_file = None
        self.transcript = None
        self.recording_thread = None
        self.confidence = 0.0
        self.processing_mode = None

        self.CHUNK = 1024
        self.FORMAT = pyaudio.paFloat32
        self.CHANNELS = 1
        self.RATE = 16000
        self.SILENCE_THRESHOLD = 0.02
        self.MIN_RECORDING_LENGTH = 1.0
        self.MAX_RECORDING_LENGTH = 30.0

        self.audio_buffer = []
        self.whisper_model = None

        logger.info("Speech-to-Text Engine initialized")

    def _load_whisper_model(self):
        if not WHISPER_AVAILABLE:
            logger.error("Whisper not installed")
            return False

        try:
            if self.whisper_model is None:
                logger.info("Loading Whisper model...")
                self.whisper_model = whisper.load_model("base")
                logger.info("Whisper model loaded")
            return True
        except Exception as exc:
            logger.error("Error loading Whisper model: %s", exc)
            return False

    def start_recording(self):
        if self.is_recording:
            logger.warning("Already recording")
            return False

        try:
            self.is_recording = True
            self.audio_buffer = []
            self.transcript = None
            self.confidence = 0.0
            self.processing_mode = get_active_voice_mode()

            self.recording_thread = threading.Thread(
                target=self._record_audio,
                daemon=True,
            )
            self.recording_thread.start()

            logger.info("Recording started (%s mode)", self.processing_mode)
            return True

        except Exception as exc:
            logger.error("Error starting recording: %s", exc)
            self.is_recording = False
            return False

    def stop_recording(self):
        if not self.is_recording:
            logger.warning("Not recording")
            return False

        try:
            self.is_recording = False

            if self.recording_thread:
                self.recording_thread.join(timeout=5)

            if self.audio_buffer:
                self._process_audio()
            else:
                self.transcript = ""

            logger.info("Recording stopped. Transcript: %s", self.transcript)
            return True

        except Exception as exc:
            logger.error("Error stopping recording: %s", exc)
            self.transcript = f"[Error: {exc}]"
            return False

    def _record_audio(self):
        p = None
        stream = None
        try:
            p = pyaudio.PyAudio()
            stream = p.open(
                format=self.FORMAT,
                channels=self.CHANNELS,
                rate=self.RATE,
                input=True,
                frames_per_buffer=self.CHUNK,
            )

            recording_duration = 0.0
            silence_duration = 0.0

            while self.is_recording:
                data = stream.read(self.CHUNK, exception_on_overflow=False)
                audio_data = np.frombuffer(data, dtype=np.float32)

                self.audio_buffer.append(audio_data)

                energy = float(np.sqrt(np.mean(audio_data ** 2)))
                chunk_duration = len(audio_data) / self.RATE
                recording_duration += chunk_duration

                if recording_duration >= self.MAX_RECORDING_LENGTH:
                    logger.info("Maximum recording length reached")
                    self.is_recording = False
                    break

                if energy < self.SILENCE_THRESHOLD:
                    silence_duration += chunk_duration
                else:
                    silence_duration = 0.0

                if (
                    silence_duration >= 2.0
                    and recording_duration >= self.MIN_RECORDING_LENGTH
                ):
                    logger.info("Silence detected; stopping recording")
                    self.is_recording = False
                    break

        except Exception as exc:
            logger.error("Fatal audio recording error: %s", exc)
            self.is_recording = False
        finally:
            if stream:
                try:
                    stream.stop_stream()
                    stream.close()
                except Exception:
                    pass
            if p:
                try:
                    p.terminate()
                except Exception:
                    pass

    def _process_audio(self):
        combined_audio = np.concatenate(self.audio_buffer)

        temp_file = os.path.join(
            os.path.dirname(os.path.abspath(__file__)),
            "temp_audio.wav",
        )

        try:
            self._save_audio_file(combined_audio, temp_file)

            mode = self.processing_mode or get_active_voice_mode()

            if mode == "online":
                result = transcribe_online_audio(temp_file)

                if result.get("status") == "success":
                    self.transcript = result.get("transcript", "").strip()
                    self.confidence = 1.0 if self.transcript else 0.0
                else:
                    self.transcript = (
                        f"[Online STT Error: {result.get('message', 'Unknown error')}]"
                    )
                    self.confidence = 0.0
            else:
                if self._load_whisper_model():
                    self._transcribe_audio(temp_file)
                else:
                    self.transcript = "[Error: Whisper not available]"
                    self.confidence = 0.0

        except Exception as exc:
            logger.error("Error processing audio: %s", exc)
            self.transcript = f"[Transcription Error: {exc}]"
            self.confidence = 0.0
        finally:
            if os.path.exists(temp_file):
                try:
                    os.remove(temp_file)
                except OSError:
                    logger.warning("Could not remove temporary audio file")

    def _save_audio_file(self, audio_data, filename):
        with wave.open(filename, "wb") as wav_file:
            wav_file.setnchannels(self.CHANNELS)
            wav_file.setsampwidth(2)
            wav_file.setframerate(self.RATE)

            clipped = np.clip(audio_data, -1.0, 1.0)
            audio_int16 = np.int16(clipped * 32767)
            wav_file.writeframes(audio_int16.tobytes())

    def _transcribe_audio(self, audio_file):
        try:
            result = self.whisper_model.transcribe(
                audio_file,
                language="en",
                verbose=False,
            )

            self.transcript = result.get("text", "").strip()

            segments = result.get("segments") or []
            if segments:
                values = [
                    float(segment.get("confidence", 0.0))
                    for segment in segments
                    if segment.get("confidence") is not None
                ]
                self.confidence = (
                    sum(values) / len(values) if values else 0.0
                )
            else:
                self.confidence = 0.0

        except Exception as exc:
            logger.error("Whisper transcription error: %s", exc)
            self.transcript = f"[Transcription Error: {exc}]"
            self.confidence = 0.0

    def get_transcript(self):
        return {
            "transcript": self.transcript,
            "confidence": self.confidence,
            "mode": self.processing_mode,
            "timestamp": datetime.now().isoformat(),
        }

    def get_status(self):
        return {
            "is_recording": self.is_recording,
            "status": "recording" if self.is_recording else "idle",
            "whisper_available": WHISPER_AVAILABLE,
            "mode": get_active_voice_mode(),
            "processing_mode": self.processing_mode,
            "timestamp": datetime.now().isoformat(),
        }

    def clear_transcript(self):
        self.transcript = None
        self.confidence = 0.0
        self.processing_mode = None


stt_engine = SpeechToTextEngine()


def start_recording():
    return stt_engine.start_recording()


def stop_recording():
    result = stt_engine.stop_recording()
    if result:
        return stt_engine.get_transcript()
    return {"error": "Failed to stop recording"}


def get_stt_status():
    return stt_engine.get_status()


def get_stt_transcript():
    return stt_engine.get_transcript()


def clear_stt_transcript():
    stt_engine.clear_transcript()
    return {"status": "success", "message": "Transcript cleared"}
