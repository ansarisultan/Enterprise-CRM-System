import React from 'react';

export default function StatsCard({ title, value, icon, color }) {
  return (
    <div className={`bg-${color}-500 text-white p-6 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-200">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="text-5xl opacity-20">{icon}</div>
      </div>
    </div>
  );
}
