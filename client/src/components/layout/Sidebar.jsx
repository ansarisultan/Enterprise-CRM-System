import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  Settings, 
  HelpCircle,
  Zap,
  Sparkles,
  Activity,
  Circle,
  Square,
  Triangle
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/leads/add', label: 'Add Lead', icon: Plus },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#050715]/95 backdrop-blur-2xl border-r border-white/5 flex flex-col p-4 flex-shrink-0 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/5 rounded-full blur-3xl" />

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
        <button className="sidebar-3d w-full">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="sidebar-3d w-full">
          <HelpCircle className="w-4 h-4" />
          Help
        </button>
        
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-400/5 border border-primary-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:scale-150 transition duration-500" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <span className="text-xs font-semibold text-white">Premium</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Upgrade to Pro for more features</p>
            <button className="mt-2 text-[10px] px-3 py-1 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition border border-primary-500/20">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
