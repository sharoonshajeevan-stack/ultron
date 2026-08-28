# 🚀 ULTRON OS - Complete Setup Guide

Step-by-step instructions to get ULTRON OS running on your Windows 11 PC.

---

## ✅ **Prerequisites Check**

- [ ] Windows 11
- [ ] Python 3.12.10 installed
- [ ] Node.js installed (v16+)
- [ ] ~20GB free disk space
- [ ] Microphone connected
- [ ] Speakers/Headphones connected

---

## 📦 **Step 1: Install Dependencies**

### **1.1 Install Ollama**

1. Go to https://ollama.ai
2. Click "Download" → Windows
3. Run installer (`OllamaSetup.exe`)
4. Follow installation wizard
5. **Restart your computer**

**Verify installation:**
```powershell
ollama --version
# Should show version number
```

### **1.2 Download AI Model**

Open PowerShell and run:
```powershell
ollama pull mistral
```

⏳ **Wait 5-10 minutes** (downloads ~4GB model)

When done, you'll see:
pulling manifest
...
success


### **1.3 Verify Python**

```powershell
python --version
# Should show: Python 3.12.10
```

If not installed, download from https://python.org

### **1.4 Verify Node.js**

```powershell
node --version
npm --version
# Should show version numbers
```

If not installed, download from https://nodejs.org

---

## 📁 **Step 2: Setup Project Folders**

### **2.1 Create Main Directory**

```powershell
mkdir D:\ULTRON-OS
cd D:\ULTRON-OS
```

### **2.2 Organize Folders**

Your structure should look like:

D:\ULTRON-OS
├── frontend\ (React UI)
├── backend\ (Python API)
└── README.md


---

## 🐍 **Step 3: Setup Backend**

### **3.1 Create Backend Folder**

```powershell
mkdir D:\ULTRON-OS\backend
mkdir D:\ULTRON-OS\backend\logs
mkdir D:\ULTRON-OS\backend\memory
cd D:\ULTRON-OS\backend
```

### **3.2 Create Requirements File**

Create `D:\ULTRON-OS\backend\requirements.txt`:

Flask==3.0.0
Flask-CORS==4.0.0
python-dotenv==1.0.0
pyaudio==0.2.13
openai-whisper==20231117
pyttsx3==2.90
psutil==5.9.6
requests==2.31.0


### **3.3 Install Dependencies**

```powershell
pip install -r requirements.txt
```

⏳ **Wait 10-15 minutes** for all packages to install

### **3.4 Create .env File**

Create `D:\ULTRON-OS\backend\.env`:

FLASK_ENV=development
FLASK_DEBUG=True
API_PORT=5000
API_HOST=0.0.0.0
OLLAMA_HOST=http://localhost:11434


### **3.5 Add Python Files**

Copy all `.py` files from documentation into backend folder:
- main.py
- ai_engine.py
- speech_to_text.py
- text_to_speech.py
- wake_word_detector.py
- system_commands.py
- memory_system.py
- ollama_service.py

---

## ⚛️ **Step 4: Setup Frontend**

### **4.1 Create Frontend Folder**

```powershell
mkdir D:\ULTRON-OS\frontend
cd D:\ULTRON-OS\frontend
npm create vite@latest . -- --template react
```

### **4.2 Install Dependencies**

```powershell
npm install
```

⏳ **Wait 5 minutes**

### **4.3 Install 3D Graphics**

```powershell
npm install three react-three-fiber @react-three/drei @react-three/postprocessing framer-motion
```

### **4.4 Copy React Files**

Create the following files in `D:\ULTRON-OS\frontend\src\`:

**folders to create:**
- components/
- components/hud/
- services/
- scenes/
- context/
- config/
- hooks/
- materials/
- shaders/
- styles/
- utils/

**Files to copy:**
- App.jsx
- main.jsx
- index.css
- App.css
- AIStateProvider.jsx (in context/)
- CoreScene.jsx (in scenes/)
- HUD.jsx (in components/hud/)
- APITest.jsx (in components/)
- WakeWordDetector.jsx (in components/)
- AIConsole.jsx (in components/)
- SpeechToText.jsx (in components/)
- SystemCommands.jsx (in components/)
- TextToSpeech.jsx (in components/)
- api.js (in services/)

---

## 🚀 **Step 5: Run ULTRON OS**

### **Terminal 1: Start Ollama**

```powershell
ollama serve
```

**Wait for:**

listening on 127.0.0.1:11434


✅ **Keep this running!**

### **Terminal 2: Start Backend**

```powershell
cd D:\ULTRON-OS\backend
python main.py
```

**Wait for:**

Running on http://127.0.0.1:5000


✅ **Keep this running!**

### **Terminal 3: Start Frontend**

```powershell
cd D:\ULTRON-OS\frontend
npm run dev
```

**Wait for:**

Local: http://localhost:5173/


✅ **Keep this running!**

### **Open Browser**

Go to: `http://localhost:5173/`

🎉 **ULTRON OS is running!**

---

## 🧪 **Test Everything**

### **Test 1: AI Console**
- Type "hello"
- Click "Send Test"
- Should see response

### **Test 2: Wake Word**
- Click "Start Listening"
- Status should show "Listening for Ultron"
- Click "Test Detection"
- Should see "ULTRON DETECTED!"

### **Test 3: Speech-to-Text**
- Click "Start Recording"
- Speak into microphone
- Click "Stop Recording"
- Should see transcript

### **Test 4: System Commands**
- Click "Google" button
- Should open in browser
- Click "Notepad"
- Should launch Notepad

### **Test 5: Ollama AI**
In browser console (F12):
```javascript
fetch('http://localhost:5000/api/ollama/generate', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ prompt: 'What is your name?' })
}).then(r => r.json()).then(d => console.log(d.data.data.response))
```

Should get response from Mistral AI!

---

## 📋 **Troubleshooting**

### **Port 5000 Already in Use**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### **Port 11434 Already in Use**
Ollama is already running. Just proceed!

### **Microphone Not Working**
1. Check Windows sound settings
2. Ensure microphone is default device
3. Test in Windows Sound settings
4. Restart PyAudio: `pip install --upgrade pyaudio`

### **Whisper Model Not Found**
```powershell
pip install --upgrade openai-whisper
```

### **Ollama "Model Not Found"**
```powershell
ollama pull mistral
```

### **Python Version Wrong**
```powershell
python --version
# If not 3.12.10, update Python
```

---

## ✅ **You're Done!**

ULTRON OS is ready to use! 🎉

**Quick Start Next Time:**
1. Open Terminal 1: `ollama serve`
2. Open Terminal 2: `cd D:\ULTRON-OS\backend && python main.py`
3. Open Terminal 3: `cd D:\ULTRON-OS\frontend && npm run dev`
4. Open browser: `http://localhost:5173/`

---

**Have fun with ULTRON OS!** 🚀