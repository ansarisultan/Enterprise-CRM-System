import React from 'react';
import { Link } from 'react-router-dom';

export default function LeadTable({ leads }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Company</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-3 text-center text-gray-500">
                No leads found
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{lead.name}</td>
                <td className="px-6 py-3">{lead.email}</td>
                <td className="px-6 py-3">{lead.company}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-1 rounded ${lead.status === 'New' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-3 flex gap-2">
                  <Link to={`/edit-lead/${lead.id}`} className="bg-blue-600 text-white px-3 py-1 rounded">
                    Edit
                  </Link>
                  <button className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
