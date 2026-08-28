# 🤖 ULTRON OS - AI Voice Assistant

A **futuristic AI desktop assistant** for Windows 11 with voice input/output, system control, memory, and offline AI processing.

![ULTRON OS](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.12.10-blue)
![React](https://img.shields.io/badge/React-19.2.8-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ **Features**

### 🎤 **Voice Interaction**
- **Wake Word Detection** - Listen for "Ultron" voice command
- **Speech-to-Text** - Convert voice to text using OpenAI Whisper
- **Text-to-Speech** - Convert AI responses back to voice with customizable speed/volume
- **Real-time Audio Processing** - Fast audio capture and playback

### 🤖 **AI Intelligence**
- **Ollama Integration** - Run local Mistral AI models (offline, no internet needed)
- **Smart Command Processing** - Understand natural language commands
- **Conversation History** - Context-aware responses based on memory
- **Fallback System** - Works even if internet connection fails

### 💾 **Memory System**
- **Persistent Storage** - Save all conversations to JSON
- **Search Functionality** - Find past conversations by keyword
- **Context Awareness** - AI recalls previous chats
- **Statistics & Analytics** - Track memory usage and patterns

### 🖥️ **System Control**
- **Launch Applications** - Open any Windows app (Notepad, Chrome, etc.)
- **Web Browser** - Open URLs in default browser
- **File Management** - Open and manage files
- **System Commands** - Shutdown, restart PC with permission system
- **Process Monitoring** - View running applications and system resources

### 🎨 **Beautiful UI**
- **3D Cinematic Interface** - JARVIS/Ultron-style holographic design
- **Real-time Status Display** - See AI state (idle, listening, thinking, responding)
- **Interactive Components** - HUD, command history, system status
- **Dark Theme** - Eye-friendly sci-fi aesthetic

---

## 🏗️ **Architecture**

### **Tech Stack**
- **Frontend:** React 19.2.8 + Vite + Three.js (3D graphics)
- **Backend:** Python 3.12.10 + Flask API
- **AI:** Ollama (Mistral model) + OpenAI Whisper
- **Voice:** pyttsx3 (Text-to-Speech) + PyAudio (Voice capture)
- **Database:** JSON file storage (local)

### **Project Structure**

ULTRON-OS/
├── frontend/ # React UI
│ ├── src/
│ │ ├── components/ # UI components (HUD, TTS, STT, etc.)
│ │ ├── services/ # API communication
│ │ ├── scenes/ # 3D scene rendering
│ │ ├── context/ # React state management
│ │ └── App.jsx # Main component
│ ├── package.json
│ └── vite.config.js
│
├── backend/ # Python API
│ ├── main.py # Flask server (port 5000)
│ ├── ai_engine.py # AI command processing
│ ├── speech_to_text.py # Voice-to-text conversion
│ ├── text_to_speech.py # Text-to-voice conversion
│ ├── wake_word_detector.py # "Ultron" detection
│ ├── system_commands.py # Windows control
│ ├── memory_system.py # Conversation storage
│ ├── ollama_service.py # Local LLM integration
│ ├── requirements.txt # Python dependencies
│ └── memory/ # Persistent storage
│ └── conversations.json
│
└── README.md # This file
---

## 🚀 **Quick Start**

### **Prerequisites**
- Windows 11
- Python 3.12.10
- Node.js (for React)
- Ollama (for AI)
- ~4GB disk space (for Mistral model)

### **Installation**

#### **1. Install Ollama**
1. Download from https://ollama.ai
2. Run installer
3. Download Mistral model:
```powershell
ollama pull mistral
```

#### **2. Setup Backend**
```powershell
cd D:\ULTRON-OS\backend

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py
```
Server runs on: `http://localhost:5000`

#### **3. Setup Frontend**
```powershell
cd D:\ULTRON-OS\frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
UI runs on: `http://localhost:5173`

#### **4. Start Ollama**
```powershell
ollama serve
```
Ollama runs on: `http://localhost:11434`

---

## 📖 **Usage Guide**

### **Starting ULTRON OS**

1. **Terminal 1:** Start Ollama
```powershell
   ollama serve
```

2. **Terminal 2:** Start Python backend
```powershell
   cd D:\ULTRON-OS\backend
   python main.py
```

3. **Terminal 3:** Start React frontend
```powershell
   cd D:\ULTRON-OS\frontend
   npm run dev
```

4. **Browser:** Open http://localhost:5173

### **Voice Interaction**

#### **Wake Word Detection (Top-Right Box)**
- Click "Start Listening" to activate wake word detection
- Say "Ultron" to trigger
- Shows detection status and timestamp

#### **Speech-to-Text (Left Side Box)**
- Click "Start Recording" to begin recording
- Speak clearly for 3-5 seconds
- Click "Stop Recording" to process
- Transcript appears with confidence score

#### **AI Console (Right Side Box)**
- Type commands like "hello", "status", "help", "time"
- Click "Send Test" or use quick buttons
- AI responds with relevant information
- Responses saved to memory

#### **Text-to-Speech (Hidden but functional)**
- AI responses are automatically converted to speech
- Control volume and speed through API
- Customizable voice selection

### **System Commands (Middle Box)**

#### **Launch Apps**
- Quick buttons: Notepad, Explorer, CMD, Chrome
- Or type custom app name
- Apps launch immediately

#### **Open URLs**
- Quick buttons: Google, YouTube, GitHub
- Or paste custom URL
- Opens in default browser

#### **Permissions Panel**
- Toggle permissions for sensitive commands
- shutdown: Requires explicit permission
- restart: Requires explicit permission
- launch_app: Enabled by default
- open_url: Enabled by default

#### **System Monitor**
- Click "Show Processes" to view running apps
- See CPU cores, RAM usage, disk space
- Monitor system health

---

## 🔧 **API Endpoints**

### **AI & Commands**
- `POST /api/ai/process` - Process command through AI
- `GET /api/ai/status` - Get AI engine status
- `GET /api/ai/history` - Get command history
- `DELETE /api/ai/history` - Clear history

### **Speech-to-Text**
- `POST /api/stt/start` - Start recording
- `POST /api/stt/stop` - Stop and transcribe
- `GET /api/stt/status` - Get recording status
- `GET /api/stt/transcript` - Get last transcript

### **Text-to-Speech**
- `POST /api/tts/speak` - Convert text to speech
- `POST /api/tts/stop` - Stop speaking
- `GET /api/tts/voices` - Get available voices
- `POST /api/tts/rate` - Set speech speed
- `POST /api/tts/volume` - Set volume level

### **System Commands**
- `POST /api/system/shutdown` - Shutdown PC
- `POST /api/system/restart` - Restart PC
- `POST /api/system/launch-app` - Launch application
- `POST /api/system/open-url` - Open URL
- `GET /api/system/processes` - Get running processes
- `GET /api/system/info` - Get system info
- `GET /api/system/permissions` - Get permissions
- `POST /api/system/permissions` - Set permissions

### **Memory System**
- `POST /api/memory/add` - Add conversation to memory
- `GET /api/memory/recent` - Get recent memories
- `POST /api/memory/search` - Search memories
- `GET /api/memory/context` - Get conversation context
- `GET /api/memory/status` - Get memory status
- `GET /api/memory/stats` - Get memory statistics
- `GET /api/memory/export` - Export all memories
- `POST /api/memory/clear-session` - Clear session
- `POST /api/memory/clear-all` - Clear all memory

### **Ollama AI**
- `GET /api/ollama/status` - Check if Ollama running
- `GET /api/ollama/models` - List available models
- `POST /api/ollama/generate` - Generate response
- `POST /api/ollama/chat` - Chat with context
- `POST /api/ollama/model` - Set active model

---

## ⚙️ **Configuration**

### **Backend Settings** (`D:\ULTRON-OS\backend\.env`)
FLASK_ENV=development
API_PORT=5000
OLLAMA_HOST=http://localhost:11434
### **AI Models**
- **Local:** Mistral (4B parameters, ~4GB)
- **Fast:** mistral:latest (recommended)
- **Larger:** Other Ollama models available

### **Voice Settings**
- **Speech Rate:** 50-300 (default: 150)
- **Volume:** 0.0-1.0 (default: 1.0)
- **Languages:** English (expandable)

### **Memory Settings**
- **Short-term:** Last 50 messages in session
- **Long-term:** Last 1000 messages persisted
- **Storage:** `backend/memory/conversations.json`

---

## 🛠️ **Troubleshooting**

### **Issue: Ollama not connecting**
Error: Connection refused to localhost:11434

**Solution:**
1. Ensure Ollama is running: `ollama serve`
2. Check port 11434 is open
3. Restart Ollama service

### **Issue: Microphone not working**

Error: No audio device found

**Solution:**
1. Check Windows audio settings
2. Ensure microphone is enabled
3. Check PyAudio installation: `pip install --upgrade pyaudio`

### **Issue: Whisper model not found**

Error: Model not found

**Solution:**
1. Install Whisper: `pip install openai-whisper`
2. Download model: `whisper --model base`
3. May take 5-10 minutes first run

### **Issue: Port already in use**

Error: Address already in use

**Solution:**
```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

---

## 📊 **Performance**

### **Typical Response Times**
- **Wake Word Detection:** <100ms
- **Speech-to-Text:** 2-5 seconds
- **AI Response (Ollama):** 5-15 seconds (first run longer)
- **Text-to-Speech:** <2 seconds
- **System Command:** <500ms

### **System Requirements**
- **CPU:** 4+ cores recommended
- **RAM:** 8GB minimum (16GB+ recommended)
- **Disk:** 20GB free (10GB for Ollama models)
- **Network:** Optional (works offline!)

---

## 🔐 **Security & Privacy**

✅ **Privacy-First Design**
- All data stored locally
- No cloud sync (optional)
- Full conversation history under your control
- Permission system for sensitive commands

✅ **Permissions**
- Shutdown/Restart requires explicit permission
- File access logged
- URL opening checked
- System commands audited

✅ **Data Protection**
- Conversations stored as JSON (plaintext)
- Can export or delete anytime
- No telemetry or tracking
- Open-source (audit the code!)

---

## 🚀 **Future Enhancements**

- [ ] Add more AI models (Llama 2, Neural Chat)
- [ ] Implement conversation backup/cloud sync
- [ ] Add plugins/extensions system
- [ ] Mobile app control (Android/iOS)
- [ ] Advanced gesture control
- [ ] Custom wake words
- [ ] Multi-language support
- [ ] Video/webcam integration
- [ ] Database instead of JSON
- [ ] Docker containerization

---

## 📝 **Dependencies**

### **Python (Backend)**

Flask==3.0.0
Flask-CORS==4.0.0
python-dotenv==1.0.0
pyaudio==0.2.13
openai-whisper==20231117
pyttsx3==2.90
psutil==5.9.6
requests==2.31.0


### **Node.js (Frontend)**

react@19.2.8
vite@8.2.0
three@0.185.1
react-three-fiber@9.7.0
framer-motion@13.0.0


### **External Services**
- **Ollama** (local LLM)
- **Whisper** (speech-to-text)
- **pyttsx3** (text-to-speech)

---

## 📜 **License**

MIT License - Free to use and modify!

---

## 👨‍💻 **Author**

Built with ❤️ by Sharoon

---

## 🤝 **Contributing**

Want to improve ULTRON OS? Contributions welcome!

1. Fork the project
2. Create your feature branch
3. Make your changes
4. Submit a pull request

---

## 📞 **Support**

Having issues? Check:
1. Troubleshooting section above
2. GitHub issues
3. Discord community (if applicable)

---

## 🎯 **Project Status**

✅ **Production Ready**
- All core features implemented
- Stable and tested
- Ready for daily use

---

**ULTRON OS - The future is now. 🚀**