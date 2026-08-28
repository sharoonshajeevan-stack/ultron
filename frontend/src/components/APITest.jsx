// ============================================================================
// API TEST COMPONENT - Test communication between React and Python
// File: src/components/APITest.jsx
// Purpose: Display API status and test connection
// ============================================================================

import { useState, useEffect } from 'react';
import { checkHealth, testAPI, processCommand } from '../services/api';

export default function APITest() {
  const [apiStatus, setApiStatus] = useState('Checking...');
  const [apiColor, setApiColor] = useState('yellow');
  const [testMessage, setTestMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check API status on component load
  useEffect(() => {
    const checkAPIStatus = async () => {
      setLoading(true);
      const result = await checkHealth();

      if (result.success) {
        setApiStatus('✅ API Connected');
        setApiColor('green');
      } else {
        setApiStatus('❌ API Disconnected');
        setApiColor('red');
      }
      setLoading(false);
    };

    checkAPIStatus();
  }, []);

  const handleTestMessage = async (e) => {
    e.preventDefault();
    if (!testMessage.trim()) return;

    setLoading(true);
    const result = await testAPI({ message: testMessage });
    setResponse(result);
    setTestMessage('');
    setLoading(false);
  };

  const handleCommand = async (command) => {
    setLoading(true);
    const result = await processCommand(command);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: `2px solid ${apiColor === 'green' ? '#00ff00' : apiColor === 'red' ? '#ff0000' : '#ffff00'}`,
        borderRadius: '10px',
        padding: '20px',
        color: '#00ff00',
        fontFamily: 'monospace',
        maxWidth: '400px',
        zIndex: 9999,
      }}
    >
      <div style={{ marginBottom: '10px', fontSize: '14px' }}>
        <strong>ULTRON API Status:</strong> {apiStatus}
      </div>

      <form onSubmit={handleTestMessage} style={{ marginBottom: '10px' }}>
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Type test message..."
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            backgroundColor: '#1a1a1a',
            border: '1px solid #00ff00',
            color: '#00ff00',
            fontFamily: 'monospace',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#00ff00',
            color: '#000000',
            border: 'none',
            borderRadius: '5px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? 'Sending...' : 'Send Test'}
        </button>
      </form>

      <div style={{ marginBottom: '10px', fontSize: '12px' }}>
        <button
          onClick={() => handleCommand('hello')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '6px',
            marginBottom: '5px',
            backgroundColor: '#003300',
            color: '#00ff00',
            border: '1px solid #00ff00',
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px',
          }}
        >
          Say Hello
        </button>
        <button
          onClick={() => handleCommand('status')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '6px',
            backgroundColor: '#003300',
            color: '#00ff00',
            border: '1px solid #00ff00',
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '12px',
          }}
        >
          Get Status
        </button>
      </div>

      {response && (
        <div
          style={{
            backgroundColor: '#0a0a0a',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '11px',
            maxHeight: '150px',
            overflowY: 'auto',
            marginTop: '10px',
          }}
        >
          <strong>Response:</strong>
          <pre
            style={{
              margin: '5px 0 0 0',
              color: response.success ? '#00ff00' : '#ff0000',
            }}
          >
            {JSON.stringify(response.data || response.error, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ fontSize: '10px', marginTop: '10px', opacity: 0.7 }}>
        Server: http://localhost:5000
      </div>
    </div>
  );
}