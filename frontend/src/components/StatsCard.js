import React from 'react';

function StatsCard({ title, value, icon, gradient }) {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <div className={`bg-gradient-to-r ${gradient} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
