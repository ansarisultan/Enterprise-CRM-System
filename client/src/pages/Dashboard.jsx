import React from 'react';
import StatsCard from '../components/StatsCard';

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard title="Total Leads" value="24" icon="📊" color="blue" />
        <StatsCard title="In Progress" value="8" icon="⏳" color="yellow" />
        <StatsCard title="Closed Deals" value="12" icon="✅" color="green" />
        <StatsCard title="Conversion Rate" value="50%" icon="📈" color="purple" />
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Leads</h2>
          <p className="text-gray-500">No recent leads</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Activity</h2>
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    </div>
  );
}
