import React, { useEffect, useRef } from 'react';

function LogsPanel({ logs }) {
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLogColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-gray-300';
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      default:
        return '●';
    }
  };

  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-gray-700 shadow-xl">
      <div className="px-6 py-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Live Activity Logs</h3>
      </div>
      <div className="p-4 h-96 overflow-y-auto bg-gray-900 bg-opacity-50 font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No logs yet. Start the bot to see activity.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className={`${getLogColor(log.type)} flex-shrink-0`}>
                  {getLogIcon(log.type)}
                </span>
                <span className="text-gray-500 text-xs flex-shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
                <span className={`${getLogColor(log.type)} flex-1`}>
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}

export default LogsPanel;
