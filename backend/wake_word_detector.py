# ============================================================================
# WAKE WORD DETECTOR - Simplified Version (Without Audio for Testing)
# File: D:\ULTRON-OS\backend\wake_word_detector.py
# Purpose: Detect wake word "Ultron" - Simplified for testing
# ============================================================================

import threading
import logging
from datetime import datetime
import time

logger = logging.getLogger(__name__)

# ============================================================================
# WAKE WORD DETECTOR CLASS
# ============================================================================

class WakeWordDetector:
    """
    Detects the wake word "Ultron" from microphone input.
    Simplified version for testing without audio hardware.
    """

    def __init__(self):
        self.is_listening = False
        self.wake_word = "ultron"
        self.detector_thread = None
        self.detection_callback = None
        
        logger.info("Wake Word Detector initialized")

    def set_detection_callback(self, callback):
        """Set callback function when wake word is detected"""
        self.detection_callback = callback
        logger.info("Detection callback set")

    def start_listening(self):
        """Start listening for wake word"""
        if self.is_listening:
            logger.warning("Already listening")
            return False
        
        try:
            self.is_listening = True
            logger.info("✅ Wake word detector started")
            return True
        except Exception as e:
            logger.error(f"Error starting detector: {e}")
            self.is_listening = False
            return False

    def stop_listening(self):
        """Stop listening for wake word"""
        try:
            self.is_listening = False
            logger.info("❌ Wake word detector stopped")
            return True
        except Exception as e:
            logger.error(f"Error stopping detector: {e}")
            return False

    def get_status(self):
        """Get current detector status"""
        return {
            "is_listening": self.is_listening,
            "wake_word": self.wake_word,
            "status": "listening" if self.is_listening else "stopped"
        }


# ============================================================================
# GLOBAL DETECTOR INSTANCE
# ============================================================================

detector = WakeWordDetector()


# ============================================================================
# PUBLIC FUNCTIONS
# ============================================================================

def start_wake_word_detection(callback=None):
    """Start detecting wake word"""
    if callback:
        detector.set_detection_callback(callback)
    return detector.start_listening()


def stop_wake_word_detection():
    """Stop detecting wake word"""
    return detector.stop_listening()


def get_detector_status():
    """Get detector status"""
    return detector.get_status()


def is_listening():
    """Check if detector is listening"""
    return detector.is_listening