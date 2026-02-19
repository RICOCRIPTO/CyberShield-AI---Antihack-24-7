import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SecurityStatus, SecurityLog, SecurityAdvice } from './types';
import Logo from './components/Logo';
import Terminal from './components/Terminal';
import { analyzeSecurityLog, getBreachProtocol } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<SecurityStatus>(SecurityStatus.SAFE);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [isHacked, setIsHacked] = useState(false);
  const [advice, setAdvice] = useState<SecurityAdvice | null>(null);
  const [isAirplaneMode, setIsAirplaneMode] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sirenCleanupRef = useRef<(() => void) | null>(null);

  // Sound generator for Siren
  const startSiren = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();

    const interval = setInterval(() => {
        if (osc && ctx.state !== 'closed') {
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
        }
    }, 800);

    return () => {
        clearInterval(interval);
        try {
          osc.stop();
        } catch (e) {}
    };
  }, []);

  const addLog = (message: string, level: 'info' | 'warning' | 'critical' = 'info') => {
    const newLog: SecurityLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      message,
      level
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  };

  const simulateBreach = async () => {
    setStatus(SecurityStatus.BREACH);
    setIsHacked(true);
    setIsAirplaneMode(false);
    setIsShuttingDown(false);
    addLog("BRECHA DE SEGURANÇA DETECTADA: ACESSO NÃO AUTORIZADO!", "critical");
    addLog("IP EXTERNO TENTANDO EXTRAÇÃO DE DADOS: 192.168.1.99", "critical");
    
    const protocols = await getBreachProtocol();
    setAdvice(protocols);
    sirenCleanupRef.current = startSiren();
  };

  const resetSystem = () => {
    setIsHacked(false);
    setStatus(SecurityStatus.SAFE);
    setAdvice(null);
    setIsAirplaneMode(false);
    setIsShuttingDown(false);
    
    if (sirenCleanupRef.current) {
      sirenCleanupRef.current();
      sirenCleanupRef.current = null;
    }

    if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
    }
    addLog("Sistema reinicializado. Proteção ativa.");
  };

  useEffect(() => {
    const messages = [
      "Escaneando portas TCP/UDP...",
      "Monitorando tráfego de saída...",
      "Integridade do Kernel verificada.",
      "Firewall bloqueou tentativa de conexão IP 45.x.x.x",
      "Processos em background analisados.",
      "Assinatura de malware não encontrada."
    ];

    const interval = setInterval(() => {
      if (!isHacked && !isAirplaneMode && !isShuttingDown) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        addLog(randomMsg);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHacked, isAirplaneMode, isShuttingDown]);

  return (
    <div className={`min-h-screen transition-all duration-700 ${
        isHacked ? 'bg-red-950 animate-pulse-red' : 'bg-slate-950'
    }`}>
      
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Logo size="sm" isAlert={isHacked} />
          <div>
            <h1 className="text-xl font-bold tracking-tight">CyberShield <span className="text-cyan-500 italic">24/7</span></h1>
            <p className="text-xs text-slate-400 font-mono">
                STATUS: {status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isHacked ? (
            <button 
                onClick={simulateBreach}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-all transform active:scale-95 shadow-lg shadow-red-900/20"
            >
              SIMULAR INVASÃO
            </button>
          ) : (
            <button 
                onClick={resetSystem}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md text-sm font-bold transition-all"
            >
              RESOLVER E REINICIAR
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className={`p-8 rounded-2xl border transition-all duration-700 ${
            isHacked ? 'bg-red-900/30 border-red-500' : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex flex-col items-center text-center">
              <Logo size="lg" isAlert={isHacked} />
              <h2 className={`mt-6 text-3xl font-black ${isHacked ? 'text-red-500' : 'text-slate-100'}`}>
                {isHacked ? "ESTE COMPUTADOR FOI INVADIDO!" : "PROTEÇÃO TOTAL ATIVADA"}
              </h2>
              <p className="text-slate-400 mt-2 max-w-md">
                Monitoramento proativo contra ransomware e invasões via IA Gemini.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {['Vigilância 24h', 'Análise de IA', 'Firewall Ativo'].map((label, idx) => (
                <div key={idx} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 text-center">
                  <div className="flex justify-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${isHacked ? 'bg-red-500 animate-ping' : 'bg-green-500'}`}></div>
                  </div>
                  <span className="text-xs text-slate-400 uppercase tracking-widest">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <Terminal logs={logs} />
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
              {isHacked ? "PROTOCOLO DE EMERGÊNCIA" : "IA SECURITY ADVISOR"}
            </h3>
            
            <div className="space-y-4">
              {isHacked && advice ? (
                <div className="space-y-4 animate-bounce-slow">
                  <div className="bg-red-600 p-4 rounded-xl text-white font-bold text-center">
                    {advice.summary}
                  </div>
                  <ul className="space-y-3">
                    {advice.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm bg-red-900/20 p-3 rounded-lg border border-red-500/30">
                        <span className="bg-red-600 w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold shrink-0">{i + 1}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-slate-400 text-sm leading-relaxed">
                  <p className="mb-4 italic">"Sistema operando em parâmetros normais. Proteção ativa."</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Breach Alert Modal */}
      {isHacked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-red-950/90 backdrop-blur-xl p-4">
          <div className="max-w-2xl w-full bg-slate-950 border-4 border-red-600 rounded-3xl p-8 text-center shadow-[0_0_80px_rgba(220,38,38,0.7)] animate-in zoom-in duration-300">
            
            <div className="flex justify-center mb-4 relative">
               <div className="bg-red-600/30 p-4 rounded-full animate-ping absolute top-0 w-24 h-24 blur-md"></div>
               <div className="relative">
                 <div className="text-red-500">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                 </div>
               </div>
            </div>

            <div className="mb-8">
                <h3 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-2">CyberShield Detection</h3>
                <h2 className="text-5xl font-black text-white mb-4 uppercase italic tracking-tighter drop-shadow-lg">
                    ALERTA: INVASÃO!
                </h2>
                <p className="text-slate-300 text-lg">
                    Um agente malicioso está tentando assumir o controle remoto. <br/>
                    <span className="text-red-400 font-bold uppercase tracking-widest text-sm">Siga as instruções abaixo imediatamente!</span>
                </p>
            </div>
            
            {/* INSTRUCTIONAL BLOCKS (NON-CLICKABLE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="relative p-8 rounded-2xl flex flex-col items-center bg-red-600 text-white border-2 border-white/20 shadow-2xl">
                    <span className="text-5xl mb-3">✈️</span>
                    <span className="font-black text-2xl uppercase leading-tight">CORTAR SINAL (MODO AVIÃO)</span>
                    <p className="mt-2 text-xs font-bold opacity-80 uppercase tracking-tighter">Ação Física Requerida</p>
                </div>
                <div className="relative p-8 rounded-2xl flex flex-col items-center bg-red-600 text-white border-2 border-white/20 shadow-2xl">
                    <span className="text-5xl mb-3">🔌</span>
                    <span className="font-black text-2xl uppercase leading-tight">DESLIGAR PC JÁ</span>
                    <p className="mt-2 text-xs font-bold opacity-80 uppercase tracking-tighter">Ação Física Requerida</p>
                </div>
            </div>

            <button 
                onClick={resetSystem}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full border border-white/20 transition-all active:scale-95"
            >
                Fechar alerta e monitorar
            </button>
          </div>
        </div>
      )}

      <footer className="fixed bottom-0 w-full p-2 bg-slate-900/80 border-t border-slate-800 flex justify-center text-[10px] text-slate-500 uppercase tracking-widest font-mono z-40">
        Monitoramento CyberShield AI // Gemini Guard // Vigilância Ativa
      </footer>
    </div>
  );
};

export default App;
