import { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Settings,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    <header className="h-16 border-b border-white/5 bg-dark-800/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-white">
          {getPageTitle()}
        </h1>
        <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
          v1.0
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-48 lg:w-64 bg-dark-700/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-300"
          />
        </div>

        {/* Notifications */}
        <button className="p-2 rounded-xl hover:bg-white/5 transition relative">
          <Bell className="w-5 h-5 text-slate-400" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition border border-white/5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
