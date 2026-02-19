
import React, { useEffect, useRef } from 'react';
import { SecurityLog } from '../types';

interface TerminalProps {
  logs: SecurityLog[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-slate-500 uppercase tracking-tighter">
        <span className="w-3 h-3 rounded-full bg-red-500"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span className="w-3 h-3 rounded-full bg-green-500"></span>
        <span className="ml-2">Live Monitor System Logs</span>
      </div>
      {logs.map((log) => (
        <div key={log.id} className="mb-1 flex gap-3">
          <span className="text-slate-600">[{log.timestamp}]</span>
          <span className={`${
            log.level === 'critical' ? 'text-red-500 font-bold' : 
            log.level === 'warning' ? 'text-yellow-400' : 
            'text-cyan-400'
          }`}>
            {log.level.toUpperCase()}:
          </span>
          <span className="text-slate-300">{log.message}</span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default Terminal;
