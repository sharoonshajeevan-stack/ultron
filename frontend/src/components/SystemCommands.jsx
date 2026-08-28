// ============================================================================
// SYSTEM COMMANDS COMPONENT - Control Windows system
// File: src/components/SystemCommands.jsx
// Purpose: Launch apps, open URLs, shutdown/restart
// ============================================================================

import { useState, useEffect } from 'react';
import {
  launchApp,
  openURL,
  getRunningProcesses,
  getSystemInfo,
  getSystemPermissions,
  setSystemPermission,
  shutdownSystem,
  restartSystem,
} from '../services/api';

export default function SystemCommands() {
  const [appName, setAppName] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [systemInfo, setSystemInfo] = useState(null);
  const [processes, setProcesses] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [showProcesses, setShowProcesses] = useState(false);

  useEffect(() => {
    const loadSystemInfo = async () => {
      try {
        const result = await getSystemInfo();
        if (result.success) {
          setSystemInfo(result.data.data.info);
        }
      } catch (error) {
        console.error('Error loading system info:', error);
      }
    };

    const loadPermissions = async () => {
      try {
        const result = await getSystemPermissions();
        if (result.success) {
          setPermissions(result.data.permissions);
        }
      } catch (error) {
        console.error('Error loading permissions:', error);
      }
    };

    loadSystemInfo();
    loadPermissions();
  }, []);

  const handleLaunchApp = async () => {
    if (!appName.trim()) return;

    setLoading(true);
    const result = await launchApp(appName);
    setResponse(result);
    setAppName('');
    setLoading(false);
  };

  const handleOpenURL = async () => {
    if (!urlInput.trim()) return;

    setLoading(true);
    const result = await openURL(urlInput);
    setResponse(result);
    setUrlInput('');
    setLoading(false);
  };

  const handleGetProcesses = async () => {
    setLoading(true);
    const result = await getRunningProcesses(15);
    if (result.success) {
      setProcesses(result.data.data.processes || []);
      setShowProcesses(!showProcesses);
    }
    setLoading(false);
  };

  const handleQuickApp = async (app) => {
    setLoading(true);
    const result = await launchApp(app);
    setResponse(result);
    setLoading(false);
  };

  const handleQuickURL = async (url) => {
    setLoading(true);
    const result = await openURL(url);
    setResponse(result);
    setLoading(false);
  };

  const handleTogglePermission = async (command) => {
    const newValue = !permissions[command];
    const result = await setSystemPermission(command, newValue);
    if (result.success) {
      setPermissions((prev) => ({
        ...prev,
        [command]: newValue,
      }));
    }
  };

  const handleShutdown = async () => {
    if (permissions.shutdown) {
      setLoading(true);
      const result = await shutdownSystem(30);
      setResponse(result);
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    if (permissions.restart) {
      setLoading(true);
      const result = await restartSystem(30);
      setResponse(result);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '420px',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #ff6600',
        borderRadius: '10px',
        padding: '20px',
        color: '#00ff00',
        fontFamily: 'monospace',
        maxWidth: '420px',
        maxHeight: '700px',
        overflowY: 'auto',
        zIndex: 9995,
      }}
    >
      {/* Title */}
      <div style={{ marginBottom: '15px', fontSize: '14px', fontWeight: 'bold' }}>
        🖥️ SYSTEM COMMANDS
      </div>

      {/* Launch App Section */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '5px' }}>Launch App:</div>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="e.g., notepad"
            disabled={loading}
            style={{
              flex: 1,
              padding: '6px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #ff6600',
              color: '#00ff00',
              fontFamily: 'monospace',
              fontSize: '10px',
            }}
          />
          <button
            onClick={handleLaunchApp}
            disabled={loading}
            style={{
              padding: '6px 10px',
              backgroundColor: '#ff6600',
              color: '#000000',
              border: 'none',
              borderRadius: '3px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontSize: '10px',
            }}
          >
            Launch
          </button>
        </div>

        {/* Quick Apps */}
        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleQuickApp('notepad')}
            disabled={loading}
            style={{
              padding: '4px 6px',
              backgroundColor: '#330000',
              color: '#ff6600',
              border: '1px solid #ff6600',
              borderRadius: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '9px',
            }}
          >
            Notepad
          </button>
          <button
            onClick={() => handleQuickApp('explorer')}
            disabled={loading}
            style={{
              padding: '4px 6px',
              backgroundColor: '#330000',
              color: '#ff6600',
              border: '1px solid #ff6600',
              borderRadius: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '9px',
            }}
          >
            Explorer
          </button>
          <button
            onClick={() => handleQuickApp('cmd')}
            disabled={loading}
            style={{
              padding: '4px 6px',
              backgroundColor: '#330000',
              color: '#ff6600',
              border: '1px solid #ff6600',
              borderRadius: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '9px',
            }}
          >
            CMD
          </button>
          <button
            onClick={() => handleQuickApp('chrome')}
            disabled={loading}
            style={{
              padding: '4px 6px',
              backgroundColor: '#330000',
              color: '#ff6600',
              border: '1px solid #ff6600',
              borderRadius: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '9px',
            }}
          >
            Chrome
          </button>
        </div>
      </div>

      {/* Open URL Section */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '5px' }}>Open URL:</div>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="google.com"
            disabled={loading}
            style={{
              flex: 1,
              padding: '6px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #ff6600',
              color: '#00ff00',
              fontFamily: 'monospace',
              fontSize: '10px',
            }}
          />
          <button
            onClick={handleOpenURL}
            disabled={loading}
            style={{
              padding: '6px 10px',
              backgroundColor: '#ff6600',
              color: '#000000',
              border: 'none',
              borderRadius: '3px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
              fontSize: '10px',
            }}
          >
            Open
          </button>
        </div>

        {/* Quick URLs */}
        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleQuickURL('google.com')}
            disabled={loading}
            style={{
              padding: '4px 6px',
              backgroundColor: '#330000',
              color: '#ff6600',
              border: '1px solid #ff6600',
              borderRadius: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '9px',
            }}
          >
            Google
          </button>
          <button
            onClick={() => handleQuickURL('youtube.com')}
            disabled={loading}
            style={{
              padding: '4px 6px',
              backgroundColor: '#330000',
              color: '#ff6600',
              border: '1px solid #ff6600',
              borderRadius: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '9px',
            }}
          >
            YouTube
          </button>
          <button
            onClick={() => handleQuickURL('github.com')}
            disabled={loading}
            style={{
              padding: '4px 6px',
              backgroundColor: '#330000',
              color: '#ff6600',
              border: '1px solid #ff6600',
              borderRadius: '2px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '9px',
            }}
          >
            GitHub
          </button>
        </div>
      </div>

      {/* Processes Section */}
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={handleGetProcesses}
          disabled={loading}
          style={{
            width: '100%',
            padding: '6px',
            backgroundColor: '#330000',
            color: '#ff6600',
            border: '1px solid #ff6600',
            borderRadius: '3px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '10px',
            marginBottom: '8px',
          }}
        >
          {showProcesses ? 'Hide' : 'Show'} Processes
        </button>

        {showProcesses && processes.length > 0 && (
          <div
            style={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #ff6600',
              borderRadius: '3px',
              padding: '8px',
              maxHeight: '150px',
              overflowY: 'auto',
              fontSize: '9px',
            }}
          >
            {processes.map((proc, idx) => (
              <div key={idx} style={{ marginBottom: '4px', opacity: 0.8 }}>
                <strong>{proc.name}</strong> - {proc.memory}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Permissions Section */}
      <div style={{ marginBottom: '15px' }}>
        <div style={{ fontSize: '11px', opacity: 0.7, marginBottom: '8px' }}>Permissions:</div>
        <div
          style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #ff6600',
            borderRadius: '3px',
            padding: '8px',
          }}
        >
          {Object.entries(permissions).map(([command, allowed]) => (
            <div
              key={command}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px',
                fontSize: '10px',
              }}
            >
              <span>{command.replace(/_/g, ' ')}:</span>
              <button
                onClick={() => handleTogglePermission(command)}
                style={{
                  padding: '3px 8px',
                  backgroundColor: allowed ? '#003300' : '#330000',
                  color: allowed ? '#00ff00' : '#ff0000',
                  border: `1px solid ${allowed ? '#00ff00' : '#ff0000'}`,
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '9px',
                  fontWeight: 'bold',
                }}
              >
                {allowed ? '✓' : '✗'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div
        style={{
          backgroundColor: '#330000',
          border: '2px solid #ff0000',
          borderRadius: '3px',
          padding: '10px',
          marginBottom: '15px',
        }}
      >
        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', color: '#ff0000' }}>
          ⚠️ DANGER ZONE
        </div>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={handleRestart}
            disabled={!permissions.restart}
            style={{
              flex: 1,
              padding: '6px',
              backgroundColor: permissions.restart ? '#ff6600' : '#330000',
              color: permissions.restart ? '#000000' : '#666666',
              border: 'none',
              borderRadius: '2px',
              cursor: permissions.restart ? 'pointer' : 'not-allowed',
              opacity: permissions.restart ? 1 : 0.5,
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            Restart (30s)
          </button>
          <button
            onClick={handleShutdown}
            disabled={!permissions.shutdown}
            style={{
              flex: 1,
              padding: '6px',
              backgroundColor: permissions.shutdown ? '#ff0000' : '#330000',
              color: permissions.shutdown ? '#ffffff' : '#666666',
              border: 'none',
              borderRadius: '2px',
              cursor: permissions.shutdown ? 'pointer' : 'not-allowed',
              opacity: permissions.shutdown ? 1 : 0.5,
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            Shutdown (30s)
          </button>
        </div>
        <div style={{ fontSize: '9px', marginTop: '6px', opacity: 0.8 }}>
          Enable permissions above to activate
        </div>
      </div>

      {/* System Info */}
      {systemInfo && (
        <div
          style={{
            backgroundColor: '#0a0a0a',
            border: '1px solid #ff6600',
            borderRadius: '3px',
            padding: '8px',
            fontSize: '9px',
          }}
        >
          <div style={{ marginBottom: '4px' }}>
            <strong>CPU:</strong> {systemInfo.cpu_count} cores
          </div>
          <div style={{ marginBottom: '4px' }}>
            <strong>RAM:</strong> {systemInfo.memory_available} / {systemInfo.memory_total}
          </div>
          <div>
            <strong>Disk:</strong> {systemInfo.disk_free} free
          </div>
        </div>
      )}

      {/* Response */}
      {response && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: response.success ? '#003300' : '#330000',
            border: `1px solid ${response.success ? '#00ff00' : '#ff0000'}`,
            borderRadius: '3px',
            fontSize: '9px',
            color: response.success ? '#00ff00' : '#ff0000',
          }}
        >
          {response.success ? '✅' : '❌'} {response.data?.message || response.error}
        </div>
      )}
    </div>
  );
}