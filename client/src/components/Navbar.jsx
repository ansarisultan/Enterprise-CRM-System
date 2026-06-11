import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-2xl font-bold">
          Enterprise CRM
        </Link>
        <div className="flex gap-6">
          <Link to="/dashboard" className="hover:text-blue-100">
            Dashboard
          </Link>
          <Link to="/leads" className="hover:text-blue-100">
            Leads
          </Link>
          <button className="hover:text-blue-100">Logout</button>
        </div>
      </div>
    </nav>
  );
}
