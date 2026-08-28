# ============================================================================
# ULTRON OS - MAIN API SERVER
# File: D:\ULTRON-OS\backend\main.py
# Purpose: Central API server that connects React frontend to Python backend
# ============================================================================

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import logging
from datetime import datetime
from wake_word_detector import start_wake_word_detection, stop_wake_word_detection, get_detector_status
from ai_engine import process_ai_command, get_ai_status, get_command_history, clear_command_history
from speech_to_text import start_recording, stop_recording, get_stt_status, get_stt_transcript, clear_stt_transcript
from system_commands import execute_shutdown, execute_restart, execute_launch_app, execute_open_url, execute_get_processes, execute_get_system_info, set_command_permission, get_command_permissions
from text_to_speech import speak_text_async, stop_speaking, set_voice, set_speech_rate, set_volume, get_voices, get_tts_status
from memory_system import add_memory, get_recent_memories, search_memories, get_context, get_memory_status, get_memory_stats, clear_session, clear_all, export_all_memories
from ollama_service import get_ollama_status, get_ollama_models, generate_ollama_response, chat_with_ollama, set_ollama_model

# Load environment variables from .env file
load_dotenv()

# ============================================================================
# CONFIGURATION
# ============================================================================

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (React can talk to this server)

# Configuration from .env
API_PORT = int(os.getenv('API_PORT', 5000))
API_HOST = os.getenv('API_HOST', '0.0.0.0')
FLASK_ENV = os.getenv('FLASK_ENV', 'development')

# ============================================================================
# LOGGING SETUP
# ============================================================================

# Create logs directory if it doesn't exist
if not os.path.exists('logs'):
    os.makedirs('logs')

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/api_server.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Health check endpoint - tests if API is running
    
    Response: JSON with status
    
    Example:
    GET http://localhost:5000/api/health
    Returns: {"status": "healthy", "timestamp": "2026-08-11T10:30:00"}
    """
    try:
        response = {
            "status": "healthy",
            "message": "ULTRON OS API is running",
            "timestamp": datetime.now().isoformat(),
            "environment": FLASK_ENV
        }
        logger.info("Health check passed")
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

# ============================================================================
# WELCOME ENDPOINT
# ============================================================================

@app.route('/api', methods=['GET'])
def welcome():
    """
    Welcome endpoint - shows API information
    
    Response: JSON with API details
    """
    response = {
        "name": "ULTRON OS API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/api/health",
            "welcome": "/api",
            "test": "/api/test",
            "command": "/api/command"
        },
        "timestamp": datetime.now().isoformat()
    }
    logger.info("Welcome endpoint accessed")
    return jsonify(response), 200


# ============================================================================
# WAKE WORD DETECTION ENDPOINTS
# ============================================================================

@app.route('/api/wake-word/start', methods=['POST'])
def start_wake_word():
    """
    Start listening for wake word "Ultron"
    
    Response: {"status": "success", "message": "Listening for wake word"}
    """
    try:
        def on_wake_word(data):
            logger.info(f"Wake word callback: {data}")
        
        result = start_wake_word_detection(callback=on_wake_word)
        
        logger.info("Wake word detection started")
        return jsonify({
            "status": "success",
            "message": "Listening for wake word 'Ultron'",
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error starting wake word detection: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/wake-word/stop', methods=['POST'])
def stop_wake_word():
    """
    Stop listening for wake word
    
    Response: {"status": "success", "message": "Wake word detection stopped"}
    """
    try:
        result = stop_wake_word_detection()
        
        logger.info("Wake word detection stopped")
        return jsonify({
            "status": "success",
            "message": "Wake word detection stopped",
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error stopping wake word detection: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/wake-word/status', methods=['GET'])
def wake_word_status():
    """
    Get wake word detector status
    
    Response: {"is_listening": true/false, "wake_word": "ultron", ...}
    """
    try:
        status = get_detector_status()
        
        return jsonify({
            "status": "success",
            "detector": status,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting wake word status: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

# ============================================================================
# AI ENGINE ENDPOINTS
# ============================================================================

@app.route('/api/ai/process', methods=['POST'])
def ai_process_command():
    """
    Process command through AI engine
    
    Request: {"command": "hello", "params": {...}}
    Response: {"status": "success", "response": {...}}
    """
    try:
        data = request.get_json()
        command = data.get('command', '')
        params = data.get('params', {})
        
        if not command:
            return jsonify({
                "status": "error",
                "message": "No command provided"
            }), 400
        
        result = process_ai_command(command, params)
        
        logger.info(f"AI processed command: {command}")
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error in AI processing: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/ai/status', methods=['GET'])
def ai_status():
    """
    Get AI engine status
    
    Response: {"engine": "...", "status": "ACTIVE", ...}
    """
    try:
        status = get_ai_status()
        
        return jsonify({
            "status": "success",
            "ai": status,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting AI status: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/ai/history', methods=['GET'])
def ai_history():
    """
    Get command history
    
    Query params: ?limit=10
    Response: {"history": [...], "count": N}
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        history = get_command_history(limit)
        
        return jsonify({
            "status": "success",
            "history": history,
            "count": len(history),
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/ai/history', methods=['DELETE'])
def ai_clear_history():
    """
    Clear command history
    
    Response: {"status": "success", "message": "History cleared"}
    """
    try:
        result = clear_command_history()
        
        logger.info("Command history cleared")
        return jsonify({
            "status": "success",
            "message": "History cleared",
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error clearing history: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400
# ============================================================================
# ============================================================================
# VOICE MODE ENDPOINTS
# ============================================================================

@app.route('/api/voice/mode', methods=['GET'])
def voice_mode_get():
    """Get configured and active voice mode."""
    try:
        return jsonify({
            "status": "success",
            "voice": get_voice_mode_status(),
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error getting voice mode: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


@app.route('/api/voice/mode', methods=['POST'])
def voice_mode_set():
    """
    Set voice mode.

    Request: {"mode": "offline" | "online" | "auto"}
    """
    try:
        data = request.get_json() or {}
        mode = data.get('mode', '')
        result = set_voice_mode(mode)

        logger.info(f"Voice mode changed to: {mode}")
        return jsonify({
            "status": "success",
            "voice": result,
            "timestamp": datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error setting voice mode: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


@app.route('/api/voice/process', methods=['POST'])
def voice_process():
    """
    Run a complete voice command pipeline.

    Request:
      {"text": "open YouTube"}   # optional; uses latest STT transcript when omitted

    Pipeline:
      STT transcript -> AI engine -> TTS
    """
    try:
        data = request.get_json() or {}
        text = str(data.get('text') or '').strip()

        if not text:
            transcript = get_stt_transcript()
            text = str(transcript.get('transcript') or '').strip()

        if not text:
            return jsonify({
                "status": "error",
                "message": "No voice command/transcript available"
            }), 400

        ai_result = process_ai_command(
            text,
            data.get('params') or {}
        )

        if ai_result.get('status') != 'success':
            return jsonify({
                "status": "error",
                "stage": "ai",
                "message": ai_result.get("error", "AI processing failed"),
                "ai": ai_result,
                "timestamp": datetime.now().isoformat()
            }), 400

        response_text = ai_result.get("response")
        if isinstance(response_text, (dict, list)):
            response_text = str(response_text)

        tts_result = speak_text_async(str(response_text))

        return jsonify({
            "status": "success",
            "input": text,
            "ai": ai_result,
            "tts": tts_result,
            "voice": get_voice_mode_status(),
            "timestamp": datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error processing voice pipeline: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


@app.route('/api/voice/online/status', methods=['GET'])
def voice_online_status():
    """Get online AI/STT/TTS configuration status."""
    try:
        return jsonify({
            "status": "success",
            "online": get_online_status(),
            "timestamp": datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error getting online service status: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

# TEST ENDPOINT
# ============================================================================

@app.route('/api/test', methods=['POST'])
def test_endpoint():
    """
    Test endpoint - echo back what React sends
    
    Request: JSON with any data
    Response: JSON echoing the data
    
    Example:
    POST http://localhost:5000/api/test
    Body: {"message": "Hello"}
    Returns: {"received": {"message": "Hello"}, "status": "success"}
    """
    try:
        data = request.get_json()
        logger.info(f"Test endpoint received: {data}")
        
        response = {
            "status": "success",
            "received": data,
            "message": "Echo response from ULTRON OS API"
        }
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"Test endpoint error: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 400

# ============================================================================
# COMMAND ENDPOINT (Ready for future features)
# ============================================================================

@app.route('/api/command', methods=['POST'])
def process_command():
    """
    Process commands from React UI
    
    Request: {"command": "hello", "params": {...}}
    Response: {"status": "success", "result": "..."}
    
    This will later connect to AI engine, voice system, etc.
    """
    try:
        data = request.get_json()
        command = data.get('command', '')
        
        logger.info(f"Command received: {command}")
        
        # For now, just echo back
        response = {
            "status": "success",
            "command": command,
            "result": f"Command '{command}' received. AI processing coming soon!",
            "timestamp": datetime.now().isoformat()
        }
        return jsonify(response), 200
    
    except Exception as e:
        logger.error(f"Command processing error: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400
# ============================================================================
# SPEECH-TO-TEXT ENDPOINTS
# ============================================================================

@app.route('/api/stt/start', methods=['POST'])
def stt_start_recording():
    """
    Start recording audio from microphone
    
    Response: {"status": "success", "message": "Recording started"}
    """
    try:
        result = start_recording()
        
        if result:
            logger.info("Recording started")
            return jsonify({
                "status": "success",
                "message": "Recording started",
                "timestamp": datetime.now().isoformat()
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Failed to start recording"
            }), 400
    
    except Exception as e:
        logger.error(f"Error starting recording: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/stt/stop', methods=['POST'])
def stt_stop_recording():
    """
    Stop recording and get transcript
    
    Response: {"status": "success", "transcript": "...", "confidence": 0.95}
    """
    try:
        result = stop_recording()
        
        logger.info(f"Recording stopped. Transcript: {result.get('transcript', '')}")
        return jsonify({
            "status": "success",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error stopping recording: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/stt/status', methods=['GET'])
def stt_status():
    """
    Get speech-to-text engine status
    
    Response: {"is_recording": true/false, ...}
    """
    try:
        status = get_stt_status()
        
        return jsonify({
            "status": "success",
            "stt": status,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting STT status: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/stt/transcript', methods=['GET'])
def stt_get_transcript():
    """
    Get current transcript
    
    Response: {"transcript": "...", "confidence": 0.95}
    """
    try:
        transcript = get_stt_transcript()
        
        return jsonify({
            "status": "success",
            "data": transcript,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting transcript: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/stt/transcript', methods=['DELETE'])
def stt_clear_transcript():
    """
    Clear transcript
    
    Response: {"status": "success", "message": "Transcript cleared"}
    """
    try:
        result = clear_stt_transcript()
        
        logger.info("Transcript cleared")
        return jsonify({
            "status": "success",
            "message": result.get("message", "Cleared"),
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error clearing transcript: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

# ============================================================================
# SYSTEM COMMANDS ENDPOINTS
# ============================================================================

@app.route('/api/system/shutdown', methods=['POST'])
def system_shutdown():
    """
    Shutdown system
    
    Request: {"delay": 0}
    Response: {"status": "success", "message": "..."}
    """
    try:
        data = request.get_json() or {}
        delay = data.get('delay', 0)
        
        result = execute_shutdown(delay)
        
        logger.warning(f"System shutdown requested (delay: {delay}s)")
        return jsonify(result), 200 if result['status'] == 'success' else 403
    
    except Exception as e:
        logger.error(f"Error in shutdown: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/system/restart', methods=['POST'])
def system_restart():
    """
    Restart system
    
    Request: {"delay": 0}
    Response: {"status": "success", "message": "..."}
    """
    try:
        data = request.get_json() or {}
        delay = data.get('delay', 0)
        
        result = execute_restart(delay)
        
        logger.warning(f"System restart requested (delay: {delay}s)")
        return jsonify(result), 200 if result['status'] == 'success' else 403
    
    except Exception as e:
        logger.error(f"Error in restart: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/system/launch-app', methods=['POST'])
def system_launch_app():
    """
    Launch application
    
    Request: {"app": "notepad"}
    Response: {"status": "success", "message": "..."}
    """
    try:
        data = request.get_json()
        app_name = data.get('app', '')
        
        if not app_name:
            return jsonify({
                "status": "error",
                "message": "No app name provided"
            }), 400
        
        result = execute_launch_app(app_name)
        
        logger.info(f"Launch app: {app_name}")
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error launching app: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/system/open-url', methods=['POST'])
def system_open_url():
    """
    Open URL in browser
    
    Request: {"url": "google.com"}
    Response: {"status": "success", "message": "..."}
    """
    try:
        data = request.get_json()
        url = data.get('url', '')
        
        if not url:
            return jsonify({
                "status": "error",
                "message": "No URL provided"
            }), 400
        
        result = execute_open_url(url)
        
        logger.info(f"Open URL: {url}")
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error opening URL: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/system/processes', methods=['GET'])
def system_get_processes():
    """
    Get running processes
    
    Query params: ?limit=10
    Response: {"processes": [...], "count": N}
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        
        result = execute_get_processes(limit)
        
        return jsonify({
            "status": "success",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting processes: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/system/info', methods=['GET'])
def system_get_info():
    """
    Get system information
    
    Response: {"info": {...}}
    """
    try:
        result = execute_get_system_info()
        
        return jsonify({
            "status": "success",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting system info: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/system/permissions', methods=['GET'])
def system_get_permissions():
    """
    Get system command permissions
    
    Response: {"shutdown": true/false, "restart": true/false, ...}
    """
    try:
        perms = get_command_permissions()
        
        return jsonify({
            "status": "success",
            "permissions": perms,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting permissions: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/system/permissions', methods=['POST'])
def system_set_permission():
    """
    Set command permission
    
    Request: {"command": "shutdown", "allowed": true}
    Response: {"status": "success"}
    """
    try:
        data = request.get_json()
        command = data.get('command', '')
        allowed = data.get('allowed', False)
        
        result = set_command_permission(command, allowed)
        
        logger.info(f"Permission '{command}': {allowed}")
        return jsonify({
            "status": "success",
            "message": f"Permission updated: {command} = {allowed}",
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error setting permission: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

# ============================================================================
# TEXT-TO-SPEECH ENDPOINTS
# ============================================================================

@app.route('/api/tts/speak', methods=['POST'])
def tts_speak():
    """
    Convert text to speech
    
    Request: {"text": "Hello world"}
    Response: {"status": "success", "message": "..."}
    """
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({
                "status": "error",
                "message": "No text provided"
            }), 400
        
        result = speak_text_async(text)
        
        logger.info(f"TTS: {text[:50]}...")
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error in TTS speak: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/tts/stop', methods=['POST'])
def tts_stop():
    """
    Stop text-to-speech
    
    Response: {"status": "success", "message": "..."}
    """
    try:
        result = stop_speaking()
        
        logger.info("TTS stopped")
        return jsonify({
            "status": "success",
            "message": "Speech stopped",
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error stopping TTS: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/tts/voices', methods=['GET'])
def tts_get_voices():
    """
    Get available voices
    
    Response: {"voices": [...]}
    """
    try:
        voices = get_voices()
        
        logger.info(f"Retrieved {len(voices)} voices")
        return jsonify({
            "status": "success",
            "voices": voices,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting voices: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/tts/voice', methods=['POST'])
def tts_set_voice():
    """
    Set voice
    
    Request: {"voice_id": 0}
    Response: {"status": "success", "message": "..."}
    """
    try:
        data = request.get_json()
        voice_id = data.get('voice_id', 0)
        
        result = set_voice(voice_id)
        
        logger.info(f"Voice set to ID: {voice_id}")
        return jsonify({
            "status": "success" if result else "error",
            "message": "Voice changed" if result else "Invalid voice ID",
            "timestamp": datetime.now().isoformat()
        }), 200 if result else 400
    
    except Exception as e:
        logger.error(f"Error setting voice: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/tts/rate', methods=['POST'])
def tts_set_rate():
    """
    Set speech rate (50-300)
    
    Request: {"rate": 150}
    Response: {"status": "success", "message": "..."}
    """
    try:
        data = request.get_json()
        rate = data.get('rate', 150)
        
        result = set_speech_rate(int(rate))
        
        logger.info(f"Speech rate set to: {rate}")
        return jsonify({
            "status": "success" if result else "error",
            "message": "Rate changed" if result else "Invalid rate",
            "timestamp": datetime.now().isoformat()
        }), 200 if result else 400
    
    except Exception as e:
        logger.error(f"Error setting rate: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/tts/volume', methods=['POST'])
def tts_set_volume():
    """
    Set volume (0.0-1.0)
    
    Request: {"volume": 0.8}
    Response: {"status": "success", "message": "..."}
    """
    try:
        data = request.get_json()
        volume = data.get('volume', 1.0)
        
        result = set_volume(float(volume))
        
        logger.info(f"Volume set to: {volume}")
        return jsonify({
            "status": "success" if result else "error",
            "message": "Volume changed" if result else "Invalid volume",
            "timestamp": datetime.now().isoformat()
        }), 200 if result else 400
    
    except Exception as e:
        logger.error(f"Error setting volume: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/tts/status', methods=['GET'])
def tts_status():
    """
    Get TTS status
    
    Response: {"is_speaking": true/false, ...}
    """
    try:
        status = get_tts_status()
        
        return jsonify({
            "status": "success",
            "tts": status,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting TTS status: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

# ============================================================================
# MEMORY SYSTEM ENDPOINTS
# ============================================================================

@app.route('/api/memory/add', methods=['POST'])
def memory_add():
    """
    Add conversation to memory
    
    Request: {"user_input": "...", "ai_response": "...", "tags": ["..."]}
    Response: {"status": "success", "memory": {...}}
    """
    try:
        data = request.get_json()
        user_input = data.get('user_input', '')
        ai_response = data.get('ai_response', '')
        tags = data.get('tags', [])
        
        result = add_memory(user_input, ai_response, tags)
        
        logger.info(f"Memory added: {user_input[:30]}...")
        return jsonify({
            "status": "success",
            "memory": result,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error adding memory: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/memory/recent', methods=['GET'])
def memory_recent():
    """
    Get recent memories
    
    Query params: ?limit=10
    Response: {"memories": [...], "count": N}
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        memories = get_recent_memories(limit)
        
        return jsonify({
            "status": "success",
            "memories": memories,
            "count": len(memories),
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting recent memories: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/memory/search', methods=['POST'])
def memory_search():
    """
    Search memories by keyword
    
    Request: {"keyword": "...", "limit": 10}
    Response: {"memories": [...], "count": N}
    """
    try:
        data = request.get_json()
        keyword = data.get('keyword', '')
        limit = data.get('limit', 10)
        
        if not keyword:
            return jsonify({
                "status": "error",
                "message": "No keyword provided"
            }), 400
        
        memories = search_memories(keyword, limit)
        
        logger.info(f"Memory search: '{keyword}' found {len(memories)} results")
        return jsonify({
            "status": "success",
            "memories": memories,
            "count": len(memories),
            "keyword": keyword,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error searching memories: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/memory/context', methods=['GET'])
def memory_context():
    """
    Get conversation context for AI
    
    Query params: ?limit=5
    Response: {"context": "..."}
    """
    try:
        limit = request.args.get('limit', 5, type=int)
        context = get_context(limit)
        
        return jsonify({
            "status": "success",
            "context": context,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting context: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/memory/status', methods=['GET'])
def memory_status():
    """
    Get memory system status
    
    Response: {"short_term_count": N, "long_term_count": N, ...}
    """
    try:
        status = get_memory_status()
        
        return jsonify({
            "status": "success",
            "data": status,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting memory status: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/memory/stats', methods=['GET'])
def memory_stats():
    """
    Get memory statistics
    
    Response: {"total_conversations": N, "session_conversations": N, ...}
    """
    try:
        stats = get_memory_stats()
        
        return jsonify({
            "status": "success",
            "stats": stats,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting memory stats: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/memory/export', methods=['GET'])
def memory_export():
    """
    Export all memories
    
    Response: {"memories": [...], "total": N}
    """
    try:
        data = export_all_memories()
        
        logger.info(f"Exported {len(data.get('memories', []))} memories")
        return jsonify({
            "status": "success",
            "data": data,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error exporting memories: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/memory/clear-session', methods=['POST'])
def memory_clear_session():
    """
    Clear session memory only
    
    Response: {"status": "success", "message": "..."}
    """
    try:
        result = clear_session()
        
        logger.warning("Session memory cleared")
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error clearing session: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/memory/clear-all', methods=['POST'])
def memory_clear_all():
    """
    Clear ALL memory (DANGEROUS!)
    
    Response: {"status": "success", "message": "..."}
    """
    try:
        result = clear_all()
        
        logger.critical("ALL MEMORY CLEARED!")
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Error clearing all memory: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


# ============================================================================
# OLLAMA LLM ENDPOINTS
# ============================================================================

@app.route('/api/ollama/status', methods=['GET'])
def ollama_status():
    """
    Get Ollama service status
    
    Response: {"available": true/false, "model": "...", ...}
    """
    try:
        status = get_ollama_status()
        
        return jsonify({
            "status": "success",
            "ollama": status,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting Ollama status: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/ollama/models', methods=['GET'])
def ollama_models():
    """
    Get available Ollama models
    
    Response: {"models": [...], "count": N}
    """
    try:
        models_data = get_ollama_models()
        
        return jsonify({
            "status": "success",
            "data": models_data,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting Ollama models: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/ollama/generate', methods=['POST'])
def ollama_generate():
    """
    Generate response using Ollama
    
    Request: {"prompt": "..."}
    Response: {"response": "...", "model": "...", "response_time": X}
    """
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        
        if not prompt:
            return jsonify({
                "status": "error",
                "message": "No prompt provided"
            }), 400
        
        result = generate_ollama_response(prompt)
        
        logger.info(f"Ollama generated response in {result.get('response_time', 0):.2f}s")
        return jsonify({
            "status": "success",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error generating Ollama response: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/ollama/chat', methods=['POST'])
def ollama_chat():
    """
    Chat with Ollama (with history)
    
    Request: {"messages": [...], "system_prompt": "..."}
    Response: {"response": "...", "model": "...", ...}
    """
    try:
        data = request.get_json()
        messages = data.get('messages', [])
        system_prompt = data.get('system_prompt', None)
        
        if not messages:
            return jsonify({
                "status": "error",
                "message": "No messages provided"
            }), 400
        
        result = chat_with_ollama(messages, system_prompt)
        
        logger.info(f"Ollama chat completed")
        return jsonify({
            "status": "success",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error in Ollama chat: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/api/ollama/model', methods=['POST'])
def ollama_set_model():
    """
    Set active Ollama model
    
    Request: {"model": "mistral"}
    Response: {"status": "success", "model": "..."}
    """
    try:
        data = request.get_json()
        model = data.get('model', '')
        
        if not model:
            return jsonify({
                "status": "error",
                "message": "No model specified"
            }), 400
        
        result = set_ollama_model(model)
        
        logger.info(f"Ollama model set to: {model}")
        return jsonify({
            "status": "success",
            "data": result,
            "timestamp": datetime.now().isoformat()
        }), 200
    
    except Exception as e:
        logger.error(f"Error setting Ollama model: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400
# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 - endpoint not found"""
    logger.warning(f"404 Error: {request.path}")
    return jsonify({
        "status": "error",
        "message": f"Endpoint '{request.path}' not found",
        "available_endpoints": [
            "/api/health",
            "/api",
            "/api/test",
            "/api/command"
        ]
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 - internal server error"""
    logger.error(f"500 Error: {str(error)}")
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500

# ============================================================================
# STARTUP & SHUTDOWN
# ============================================================================

@app.before_request
def before_request():
    """Log every request"""
    logger.debug(f"Request: {request.method} {request.path}")

@app.teardown_appcontext
def shutdown_session(exception=None):
    """Cleanup on shutdown"""
    if exception:
        logger.error(f"Application shutdown with error: {exception}")

# ============================================================================
# MAIN - RUN SERVER
# ============================================================================

if __name__ == '__main__':
    logger.info("=" * 80)
    logger.info("ULTRON OS API SERVER STARTING")
    logger.info("=" * 80)
    logger.info(f"Environment: {FLASK_ENV}")
    logger.info(f"Server: {API_HOST}:{API_PORT}")
    logger.info(f"API Endpoint: http://localhost:{API_PORT}/api")
    logger.info("=" * 80)
    
    # Run Flask server
    app.run(
        host=API_HOST,
        port=API_PORT,
        debug=(FLASK_ENV == 'development'),
        use_reloader=True
    )