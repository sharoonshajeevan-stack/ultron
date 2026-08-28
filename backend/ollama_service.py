# ============================================================================
# OLLAMA SERVICE - Local LLM integration
# File: D:\ULTRON-OS\backend\ollama_service.py
# Purpose: Connect to Ollama for offline AI responses
# ============================================================================

import requests
import logging
from datetime import datetime
import json

logger = logging.getLogger(__name__)

# ============================================================================
# OLLAMA SERVICE CLASS
# ============================================================================

class OllamaService:
    """
    Integrates with Ollama for local LLM inference.
    Provides fallback to default AI when Ollama unavailable.
    """

    def __init__(self, host=None, model=None):
        self.host = host
        self.model = model
        self.is_available = False
        self.response_time = 0
        
        # Check if Ollama is running
        self._check_availability()
        
        logger.info(f"Ollama Service initialized (Model: {model})")

    def _check_availability(self):
        """Check if Ollama server is running"""
        try:
            response = requests.get(f"{self.host}/api/tags", timeout=2)
            self.is_available = response.status_code == 200
            
            if self.is_available:
                logger.info("✅ Ollama server is running")
            else:
                logger.warning("❌ Ollama server not responding")
        
        except Exception as e:
            logger.warning(f"Ollama not available: {e}")
            self.is_available = False

    def get_status(self):
        """Get Ollama service status"""
        self._check_availability()
        
        return {
            "available": self.is_available,
            "host": self.host,
            "model": self.model,
            "status": "ONLINE" if self.is_available else "OFFLINE",
            "timestamp": datetime.now().isoformat()
        }

    def get_available_models(self):
        """Get list of available Ollama models"""
        try:
            if not self.is_available:
                return {
                    "status": "error",
                    "message": "Ollama not available",
                    "models": []
                }
            
            response = requests.get(f"{self.host}/api/tags", timeout=5)
            
            if response.status_code == 200:
                data = response.json()
                models = []
                
                if 'models' in data:
                    for model in data['models']:
                        models.append({
                            "name": model.get('name', 'unknown'),
                            "size": model.get('size', 0),
                            "modified": model.get('modified_at', '')
                        })
                
                logger.info(f"Found {len(models)} Ollama models")
                return {
                    "status": "success",
                    "models": models,
                    "count": len(models)
                }
            else:
                return {
                    "status": "error",
                    "message": "Failed to get models",
                    "models": []
                }
        
        except Exception as e:
            logger.error(f"Error getting models: {e}")
            return {
                "status": "error",
                "message": str(e),
                "models": []
            }

    def generate_response(self, prompt, stream=False):
        """
        Generate response using Ollama
        
        Args:
            prompt (str): User prompt
            stream (bool): Stream response character by character
        
        Returns:
            dict: Response data
        """
        try:
            if not self.is_available:
                return {
                    "status": "error",
                    "message": "Ollama not available",
                    "response": None,
                    "source": "error"
                }
            
            if not prompt or not prompt.strip():
                return {
                    "status": "error",
                    "message": "No prompt provided",
                    "response": None,
                    "source": "error"
                }
            
            logger.info(f"Generating response with {self.model}...")
            
            # Build request
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False  # We'll use non-streaming for simplicity
            }
            
            # Make request to Ollama
            start_time = datetime.now()
            response = requests.post(
                f"{self.host}/api/generate",
                json=payload,
                timeout=120  # 2 minute timeout
            )
            
            response_time = (datetime.now() - start_time).total_seconds()
            self.response_time = response_time
            
            if response.status_code == 200:
                data = response.json()
                result_text = data.get('response', '').strip()
                
                logger.info(f"Response generated in {response_time:.2f}s")
                
                return {
                    "status": "success",
                    "response": result_text,
                    "model": self.model,
                    "response_time": response_time,
                    "source": "ollama",
                    "timestamp": datetime.now().isoformat()
                }
            else:
                logger.error(f"Ollama error: {response.status_code}")
                return {
                    "status": "error",
                    "message": f"Ollama returned {response.status_code}",
                    "response": None,
                    "source": "ollama"
                }
        
        except requests.Timeout:
            logger.error("Ollama request timed out")
            return {
                "status": "error",
                "message": "Request timed out",
                "response": None,
                "source": "ollama"
            }
        
        except Exception as e:
            logger.error(f"Error generating response: {e}")
            return {
                "status": "error",
                "message": str(e),
                "response": None,
                "source": "ollama"
            }

    def chat(self, messages, system_prompt=None):
        """
        Chat with Ollama (with conversation history)
        
        Args:
            messages (list): List of messages [{"role": "user", "content": "..."}, ...]
            system_prompt (str): System prompt for context
        
        Returns:
            dict: Response data
        """
        try:
            if not self.is_available:
                return {
                    "status": "error",
                    "message": "Ollama not available",
                    "response": None
                }
            
            # Format messages into a prompt
            prompt = ""
            
            if system_prompt:
                prompt += f"System: {system_prompt}\n\n"
            
            for msg in messages:
                role = msg.get('role', 'user').capitalize()
                content = msg.get('content', '')
                prompt += f"{role}: {content}\n"
            
            prompt += "Assistant: "
            
            # Generate response
            return self.generate_response(prompt)
        
        except Exception as e:
            logger.error(f"Error in chat: {e}")
            return {
                "status": "error",
                "message": str(e),
                "response": None
            }

    def set_model(self, model_name):
        """Change the active model"""
        self.model = model_name
        logger.info(f"Model changed to: {model_name}")
        return {"status": "success", "model": model_name}


# ============================================================================
# GLOBAL OLLAMA INSTANCE
# ============================================================================

ollama_service = OllamaService()


# ============================================================================
# PUBLIC FUNCTIONS
# ============================================================================

def get_ollama_status():
    """Get Ollama status"""
    return ollama_service.get_status()


def get_ollama_models():
    """Get available models"""
    return ollama_service.get_available_models()


def generate_ollama_response(prompt):
    """Generate response using Ollama"""
    return ollama_service.generate_response(prompt)


def chat_with_ollama(messages, system_prompt=None):
    """Chat with Ollama"""
    return ollama_service.chat(messages, system_prompt)


def set_ollama_model(model_name):
    """Set active model"""
    return ollama_service.set_model(model_name)