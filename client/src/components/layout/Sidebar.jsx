import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  Settings, 
  HelpCircle,
  Zap,
  Sparkles
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/leads/add', label: 'Add Lead', icon: Plus },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-dark-800/80 backdrop-blur-xl border-r border-white/5 flex flex-col p-4 flex-shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 py-4 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-bold text-white">LeadFlow</span>
          <span className="block text-[10px] text-slate-400">CRM</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 pt-4 border-t border-white/5">
        <button className="sidebar-link w-full">
          <Settings className="w-4 h-4" />
          Settings
        </button>
        <button className="sidebar-link w-full">
          <HelpCircle className="w-4 h-4" />
          Help
        </button>
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-400/5 border border-primary-500/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-slate-300">Premium</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Upgrade to Pro for more features</p>
        </div>
      </div>
    </aside>
  );
}
