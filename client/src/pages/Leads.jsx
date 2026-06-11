import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LeadTable from '../components/LeadTable';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch leads from API
    setLoading(false);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Link to="/add-lead" className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          Add Lead
        </Link>
      </div>
      {loading ? <p>Loading...</p> : <LeadTable leads={leads} />}
    </div>
  );
}
