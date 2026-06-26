import { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Settings,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Command,
  Zap
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard';
      case '/leads': return 'Leads';
      case '/leads/add': return 'Add Lead';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#050715]/80 backdrop-blur-2xl flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white">
          {getPageTitle()}
        </h1>
        <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1">
          <Zap className="w-2.5 h-2.5 text-primary-400" />
          v1.0
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative group">
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-primary-400' : 'text-slate-400'}`}>
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search leads..."
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-48 lg:w-72 bg-white/5 border rounded-xl pl-9 pr-12 py-2 text-sm text-white 
                       placeholder-slate-400 outline-none transition-all duration-300
                       ${isSearchFocused 
                         ? 'border-primary-500/50 shadow-[0_0_30px_rgba(59,130,246,0.05)] bg-white/10' 
                         : 'border-white/10 hover:border-white/20'
                       }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-xl hover:bg-white/5 transition relative group">
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
        </button>

        {/* Quick Action */}
        <button className="p-2 rounded-xl bg-gradient-to-r from-primary-500/10 to-primary-400/5 hover:from-primary-500/20 hover:to-primary-400/10 transition border border-primary-500/10 group">
          <Sparkles className="w-5 h-5 text-primary-400 group-hover:scale-110 transition" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition border border-white/5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <User className="w-4 h-4 text-white" />
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
        </button>
      </div>
    </header>
  );
}
