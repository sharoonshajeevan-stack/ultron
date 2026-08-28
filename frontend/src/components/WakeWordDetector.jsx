// ============================================================================
// WAKE WORD DETECTOR COMPONENT - Control wake word detection
// File: src/components/WakeWordDetector.jsx
// Purpose: Start/stop listening for "Ultron" wake word
// ============================================================================

import { useState, useEffect } from 'react';
import { apiCall } from '../services/api';

export default function WakeWordDetector() {
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Stopped');
  const [statusColor, setStatusColor] = useState('red');
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  const [lastDetection, setLastDetection] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check wake word status on load
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const result = await apiCall('/wake-word/status', 'GET');
        if (result.success) {
          const isCurrentlyListening = result.data.detector.is_listening;
          setIsListening(isCurrentlyListening);
          setStatus(isCurrentlyListening ? 'Listening' : 'Stopped');
          setStatusColor(isCurrentlyListening ? 'cyan' : 'red');
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    checkStatus();
  }, []);

  const handleStartListening = async () => {
    setLoading(true);
    try {
      const result = await apiCall('/wake-word/start', 'POST');
      if (result.success) {
        setIsListening(true);
        setStatus('🎤 Listening for "Ultron"');
        setStatusColor('cyan');
        console.log('✅ Wake word detection started');
      } else {
        setStatus('❌ Failed to start');
        setStatusColor('red');
      }
    } catch (error) {
      console.error('Error starting wake word detection:', error);
      setStatus('❌ Error');
      setStatusColor('red');
    }
    setLoading(false);
  };

  const handleStopListening = async () => {
    setLoading(true);
    try {
      const result = await apiCall('/wake-word/stop', 'POST');
      if (result.success) {
        setIsListening(false);
        setStatus('Stopped');
        setStatusColor('red');
        console.log('❌ Wake word detection stopped');
      }
    } catch (error) {
      console.error('Error stopping wake word detection:', error);
    }
    setLoading(false);
  };

  const simulateWakeWordDetection = () => {
    setWakeWordDetected(true);
    setLastDetection(new Date().toLocaleTimeString());
    setTimeout(() => {
      setWakeWordDetected(false);
    }, 2000);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: `2px solid ${statusColor}`,
        borderRadius: '10px',
        padding: '20px',
        color: '#00ff00',
        fontFamily: 'monospace',
        maxWidth: '350px',
        zIndex: 9998,
        boxShadow: `0 0 20px ${statusColor}`,
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
        🎤 WAKE WORD DETECTOR
      </div>

      {/* Status */}
      <div
        style={{
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#0a0a0a',
          border: `1px solid ${statusColor}`,
          borderRadius: '5px',
          textAlign: 'center',
          fontSize: '12px',
          color: statusColor,
        }}
      >
        <div style={{ fontSize: '10px', opacity: 0.7 }}>Status:</div>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{status}</div>
      </div>

      {/* Control Buttons */}
      <div style={{ marginBottom: '15px', display: 'flex', gap: '5px' }}>
        <button
          onClick={handleStartListening}
          disabled={isListening || loading}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: isListening ? '#003300' : '#00ff00',
            color: isListening ? '#666666' : '#000000',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: isListening || loading ? 'not-allowed' : 'pointer',
            opacity: isListening || loading ? 0.5 : 1,
            fontSize: '12px',
          }}
        >
          {loading ? 'Starting...' : 'Start Listening'}
        </button>
        <button
          onClick={handleStopListening}
          disabled={!isListening || loading}
          style={{
            flex: 1,
            padding: '8px',
            backgroundColor: !isListening ? '#330000' : '#ff0000',
            color: !isListening ? '#666666' : '#ffffff',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: !isListening || loading ? 'not-allowed' : 'pointer',
            opacity: !isListening || loading ? 0.5 : 1,
            fontSize: '12px',
          }}
        >
          {loading ? 'Stopping...' : 'Stop Listening'}
        </button>
      </div>

      {/* Wake Word Detected Alert */}
      {wakeWordDetected && (
        <div
          style={{
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#003300',
            border: '2px solid #00ff00',
            borderRadius: '5px',
            textAlign: 'center',
            animation: 'pulse 0.5s',
            fontSize: '12px',
            color: '#00ff00',
            fontWeight: 'bold',
          }}
        >
          🎤 "ULTRON" DETECTED!
          {lastDetection && (
            <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.8 }}>
              {lastDetection}
            </div>
          )}
        </div>
      )}

      {/* Test Button */}
      <div style={{ marginBottom: '10px' }}>
        <button
          onClick={simulateWakeWordDetection}
          disabled={loading}
          style={{
            width: '100%',
            padding: '6px',
            backgroundColor: '#003300',
            color: '#00ff00',
            border: '1px solid #00ff00',
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            opacity: loading ? 0.5 : 1,
          }}
        >
          Test Detection
        </button>
      </div>

      {/* Info */}
      <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '10px' }}>
        <div>Wake Word: "ULTRON"</div>
        <div>Listening on: Microphone</div>
        <div style={{ marginTop: '5px' }}>
          {isListening ? '🟢 ACTIVE' : '🔴 INACTIVE'}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}