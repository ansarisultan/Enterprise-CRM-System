import { Link } from 'react-router-dom';
import { Edit2, Trash2, Mail, Phone, Building } from 'lucide-react';
import StatusBadge from './StatusBadge';
import Button from '../ui/Button';

export default function LeadTable({ leads, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-surface/30 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Contact Info</th>
            <th className="px-6 py-4">Company</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm text-slate-200">
          {leads.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="p-3 bg-white/5 rounded-full">
                    <Trash2 className="w-6 h-6 text-slate-500" />
                  </div>
                  <p className="font-medium">No leads found</p>
                  <p className="text-xs text-slate-500">Try adjusting your filters or adding a new lead.</p>
                </div>
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id || lead.id} className="hover:bg-white/5 transition-colors duration-250 group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                    {lead.name}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 text-slate-300">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {lead.email}
                    </span>
                    {lead.phone && (
                      <span className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        {lead.phone}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {lead.company ? (
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {lead.company}
                    </span>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/leads/edit/${lead._id || lead.id}`}>
                      <Button variant="secondary" className="p-2 px-2.5 rounded-lg border border-white/5 bg-white/5 hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/20">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={() => onDelete(lead._id || lead.id)}
                      className="p-2 px-2.5 rounded-lg border border-red-500/10 bg-red-500/10 text-red-400 hover:bg-red-500/30 hover:border-red-500/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
