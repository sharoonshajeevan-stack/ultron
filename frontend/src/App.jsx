// src/App.jsx
import TextToSpeech from "./components/TextToSpeech";
import WakeWordDetector from "./components/WakeWordDetector";
import AIStateProvider from "./context/AIStateProvider";

import CoreScene from "./scenes/CoreScene";
import HUD from "./components/hud/HUD";
import APITest from "./components/APITest";

import "./index.css";
import SpeechToText from "./components/SpeechToText";
import SystemCommands from "./components/SystemCommands";
import BackendBridge from "./components/hud/BackendBridge";

export default function App() {
  return (
    <AIStateProvider>
      <CoreScene />
      <BackendBridge /> 
      <HUD />
      <APITest />
      <WakeWordDetector />
      <SpeechToText />
      <SystemCommands />
      <TextToSpeech />
    </AIStateProvider>
  );
}