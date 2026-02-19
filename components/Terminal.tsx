import React from 'react';
import { SecurityLog } from '../types';

interface TerminalProps {
  logs: SecurityLog[];
}

const Terminal: React.FC<TerminalProps> = ({ logs }) => {
  return (
    <div className="bg-black text-green-400 font-mono p-4 rounded-lg h-64 overflow-y-auto">
      {logs.map(log => (
        <div key={log.id} className="text-sm">
          <span className="text-gray-500">[{log.timestamp}]</span>{' '}
          <span className={
            log.level === 'critical' ? 'text-red-500' :
            log.level === 'warning' ? 'text-yellow-500' : 'text-green-400'
          }>
            {log.level.toUpperCase()}: {log.message}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Terminal;
