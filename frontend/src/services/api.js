// ============================================================================
// API SERVICE - Handles all communication between React and Python backend
// File: src/services/api.js
// Purpose: Centralized API calls to Python Flask server
// ============================================================================

const API_BASE_URL = 'http://localhost:5000/api';

// ============================================================================
// HEALTH CHECK - Test if Python server is running
// ============================================================================

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Health Check Passed:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// WELCOME - Get API information
// ============================================================================

export const getWelcome = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Welcome Data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Welcome Failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// TEST ENDPOINT - Send test data and get echo response
// ============================================================================

export const testAPI = async (testData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Test Response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// PROCESS COMMAND - Send command to Python backend
// ============================================================================

export const processCommand = async (command, params = {}) => {
  try {
    const payload = {
      command,
      params,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(`${API_BASE_URL}/command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Command Response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Command Failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// GENERIC API CALL - For future endpoints
// ============================================================================

export const apiCall = async (endpoint, method = 'GET', payload = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (payload) {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error(`❌ API Call Failed (${endpoint}):`, error.message);
    return { success: false, error: error.message };
  }
};
// ============================================================================
// SPEECH-TO-TEXT FUNCTIONS
// ============================================================================

export const startRecording = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stt/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Recording Started:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Recording Start Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const stopRecording = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stt/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Recording Stopped:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Recording Stop Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getSTTStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stt/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ STT Status:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ STT Status Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getTranscript = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stt/transcript`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Transcript:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Transcript Fetch Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const clearTranscript = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stt/transcript`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Transcript Cleared:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Clear Transcript Failed:', error.message);
    return { success: false, error: error.message };
  }
};
// ============================================================================
// SYSTEM COMMANDS FUNCTIONS
// ============================================================================

export const shutdownSystem = async (delay = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/shutdown`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ delay }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Shutdown initiated:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Shutdown Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const restartSystem = async (delay = 0) => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/restart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ delay }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Restart initiated:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Restart Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const launchApp = async (appName) => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/launch-app`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ app: appName }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ App launched:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Launch App Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const openURL = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/open-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ URL opened:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Open URL Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getRunningProcesses = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/processes?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Processes retrieved:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Get Processes Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getSystemInfo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ System info retrieved:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Get System Info Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getSystemPermissions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/permissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Permissions retrieved:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Get Permissions Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const setSystemPermission = async (command, allowed) => {
  try {
    const response = await fetch(`${API_BASE_URL}/system/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command, allowed }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Permission updated:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Set Permission Failed:', error.message);
    return { success: false, error: error.message };
  }
};
// ============================================================================
// TEXT-TO-SPEECH FUNCTIONS
// ============================================================================

export const speakText = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tts/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Speaking:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Speak Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const stopSpeaking = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tts/stop`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Stopped speaking:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Stop Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getTTSVoices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tts/voices`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Voices retrieved:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Get Voices Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const setTTSVoice = async (voiceId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tts/voice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voice_id: voiceId }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Voice set:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Set Voice Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const setTTSRate = async (rate) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tts/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rate }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Rate set:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Set Rate Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const setTTSVolume = async (volume) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tts/volume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ volume }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Volume set:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Set Volume Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getTTSStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tts/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ TTS Status:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Get Status Failed:', error.message);
    return { success: false, error: error.message };
  }
};

// ============================================================================
// MEMORY SYSTEM FUNCTIONS
// ============================================================================

export const addMemory = async (userInput, aiResponse, tags = []) => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_input: userInput, ai_response: aiResponse, tags }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Memory added:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Add Memory Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getRecentMemories = async (limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/recent?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Recent memories:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Get Memories Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const searchMemories = async (keyword, limit = 10) => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword, limit }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Search results:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Search Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getMemoryContext = async (limit = 5) => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/context?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Context:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Get Context Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getMemoryStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Memory status:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Status Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getMemoryStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Memory stats:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Stats Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const exportMemories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/export`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Export complete:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Export Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const clearMemorySession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/clear-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Session cleared:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Clear Session Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const clearAllMemory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/memory/clear-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ All memory cleared:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Clear All Failed:', error.message);
    return { success: false, error: error.message };
  }
};
// ============================================================================
// OLLAMA LLM FUNCTIONS
// ============================================================================

export const getOllamaStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ollama/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Ollama Status:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Ollama Status Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getOllamaModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ollama/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Ollama Models:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Get Models Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const generateOllamaResponse = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ollama/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Ollama Response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Generate Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const chatWithOllama = async (messages, systemPrompt = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ollama/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, system_prompt: systemPrompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Ollama Chat:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Chat Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const setOllamaModel = async (model) => {
  try {
    const response = await fetch(`${API_BASE_URL}/ollama/model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Model Set:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Set Model Failed:', error.message);
    return { success: false, error: error.message };
  }
};
export default {
  checkHealth,
  getWelcome,
  testAPI,
  processCommand,
  apiCall,
};