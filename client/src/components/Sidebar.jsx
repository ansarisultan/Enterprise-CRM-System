import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">Menu</h2>
        <ul className="space-y-4">
          <li>
            <Link to="/dashboard" className="hover:bg-gray-800 p-2 rounded block">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/leads" className="hover:bg-gray-800 p-2 rounded block">
              Leads
            </Link>
          </li>
          <li>
            <Link to="/customers" className="hover:bg-gray-800 p-2 rounded block">
              Customers
            </Link>
          </li>
          <li>
            <Link to="/reports" className="hover:bg-gray-800 p-2 rounded block">
              Reports
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
