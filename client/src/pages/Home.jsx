import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function Home() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/customers')
      .then(response => setCustomers(response.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">CRM Overview</h2>
        <p className="mt-2 text-slate-600">This project combines React, Tailwind CSS, React Router DOM, Axios, and Chart.js with a Node.js + Express backend.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">Recent Customers</h3>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">Data from /api/customers</span>
        </div>

        {loading ? (
          <p className="mt-4 text-slate-600">Loading customers...</p>
        ) : error ? (
          <p className="mt-4 text-rose-600">Error: {error}</p>
        ) : (
          <div className="mt-4 space-y-3">
            {customers.length === 0 ? (
              <p className="text-slate-600">No customers available yet.</p>
            ) : (
              <ul className="space-y-3">
                {customers.map(customer => (
                  <li key={customer._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">{customer.name}</p>
                        <p className="text-sm text-slate-500">{customer.email}</p>
                      </div>
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">{customer.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
