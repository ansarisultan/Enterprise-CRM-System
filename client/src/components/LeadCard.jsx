import React from 'react';
import { Link } from 'react-router-dom';

export default function LeadCard({ lead }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">{lead.name}</h3>
      <p className="text-gray-600 mb-2">{lead.email}</p>
      <p className="text-gray-600 mb-2">{lead.company}</p>
      <p className="text-sm">
        <span className={`px-2 py-1 rounded ${lead.status === 'New' ? 'bg-blue-100' : 'bg-green-100'}`}>
          {lead.status}
        </span>
      </p>
      <div className="mt-4 flex gap-2">
        <Link to={`/edit-lead/${lead.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">
          Edit
        </Link>
        <button className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
      </div>
    </div>
  );
}
