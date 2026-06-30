import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  FileJson, 
  FileSpreadsheet,
  Zap,
  X
} from 'lucide-react';
import { leadAPI } from '../../services/api';
import { exportToJSON, exportToCSV } from '../../utils/exportUtils';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/leads/add', label: 'Add Lead', icon: Plus },
];

export default function Sidebar({ isOpen, onClose }) {
  const handleExportJSON = async () => {
    try {
      const response = await leadAPI.getAll();
      exportToJSON(response.data);
    } catch (error) {
      console.error('Error fetching leads for JSON export:', error);
      toast.error('Failed to retrieve leads for JSON export.');
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await leadAPI.getAll();
      exportToCSV(response.data);
    } catch (error) {
      console.error('Error fetching leads for CSV export:', error);
      toast.error('Failed to retrieve leads for CSV export.');
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#0a0f24]/95 lg:bg-[#050715]/95 backdrop-blur-2xl border-r border-white/5 flex flex-col p-4 flex-shrink-0 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button on mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-xl hover:bg-white/5 transition text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-8 relative">
          <div className="relative">
            <div className="absolute inset-0 w-10 h-10 rounded-xl bg-primary-500/20 blur-xl animate-pulse" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold text-white tracking-tight">LeadFlow</span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">CRM</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 relative">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              end
              className={({ isActive }) =>
                `sidebar-3d ${isActive ? 'active' : ''}`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="space-y-1 pt-4 border-t border-white/5 relative">
          <button 
            onClick={handleExportJSON}
            className="sidebar-3d w-full text-left flex items-center gap-3"
          >
            <FileJson className="w-4 h-4 text-blue-400" />
            <span>Export to JSON</span>
          </button>
          <button 
            onClick={handleExportCSV}
            className="sidebar-3d w-full text-left flex items-center gap-3"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-400" />
            <span>Export to CSV</span>
          </button>
        </div>
      </aside>
    </>
  );
}
