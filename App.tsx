import React, { useState, useEffect, useCallback, useRef } from 'react';

const App: React.FC = () => {
  const [isHacked, setIsHacked] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState('SEGURO');

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-9), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      addLog("INFO: Monitorando sistema...");
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const simulateBreach = () => {
    setIsHacked(true);
    setStatus('INVADIDO');
    addLog("🚨 ALERTA CRÍTICO: INVASÃO DETECTADA!");
  };

  const resetSystem = () => {
    setIsHacked(false);
    setStatus('SEGURO');
    addLog("Sistema reinicializado.");
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: isHacked ? '#450a0a' : '#0f172a',
      color: 'white',
      fontFamily: 'monospace',
      padding: '20px',
      transition: 'all 0.7s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>🛡️ CyberShield 24/7 <span style={{color: '#22d3ee'}}>STATUS: {status}</span></h1>
        <button 
          onClick={simulateBreach}
          style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          SIMULAR INVASÃO
        </button>
      </div>

      <div style={{
        backgroundColor: '#1e293b',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ color: '#4ade80' }}>{log}</div>
        ))}
      </div>

      {isHacked && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(127, 29, 29, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#0f172a',
            padding: '40px',
            borderRadius: '20px',
            border: '4px solid #dc2626',
            textAlign: 'center'
          }}>
            <h2 style={{color: '#dc2626', fontSize: '48px'}}>🚨 INVASÃO!</h2>
            <button 
              onClick={resetSystem}
              style={{
                backgroundColor: '#0891b2',
                color: 'white',
                padding: '10px 30px',
                border: 'none',
                borderRadius: '5px',
                marginTop: '20px',
                cursor: 'pointer'
              }}
            >
              FECHAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
