import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown,
  Sparkles,
  Zap,
  Menu,
  Plus,
  LogOut,
  Settings,
  Shield,
  FileSpreadsheet
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { leadAPI } from '../../services/api';
import { exportToCSV } from '../../utils/exportUtils';
import toast from 'react-hot-toast';

const MENU_OPTIONS = [
  { name: 'Dashboard', path: '/', description: 'View CRM analytics and statistics' },
  { name: 'Leads List', path: '/leads', description: 'Manage and filter all leads' },
  { name: 'Add Lead', path: '/leads/add', description: 'Create a new lead profile' },
];

export default function Navbar({ onMenuClick }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState([]);
  
  // Dropdown States
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Refs for closing on outside click
  const notificationsRef = useRef(null);
  const quickActionsRef = useRef(null);
  const profileRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    switch(location.pathname) {
      case '/': return 'Dashboard';
      case '/leads': return 'Leads';
      case '/leads/add': return 'Add Lead';
      default: return 'Dashboard';
    }
  };

  const handleFocus = async () => {
    setIsSearchFocused(true);
    try {
      const response = await leadAPI.getAll();
      setLeads(response.data || []);
    } catch (err) {
      console.error('Failed to fetch leads for navbar search:', err);
    }
  };

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search leads or pages..."]');
        if (searchInput) searchInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setIsQuickActionsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchQuery.trim() === '' ? [] : MENU_OPTIONS.filter(option =>
    option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeads = searchQuery.trim() === '' ? [] : leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const mockNotifications = [
    { id: 1, title: 'Database Connected', desc: 'Secure connection established to MongoDB Atlas cluster.', time: 'Just now', type: 'info' },
    { id: 2, title: 'New Lead Added', desc: 'Sarah Jenkins has been added as a Won lead.', time: '2 hours ago', type: 'success' },
    { id: 3, title: 'System Online', desc: 'CRM services operational.', time: 'Today', type: 'info' }
  ];

  const handleExportCSV = async () => {
    setIsQuickActionsOpen(false);
    try {
      const response = await leadAPI.getAll();
      exportToCSV(response.data);
    } catch (error) {
      console.error('Error fetching leads for CSV export in navbar:', error);
      toast.error('Failed to retrieve leads for CSV export.');
    }
  };

  const handleLogout = () => {
    toast.success('Logged out successfully! Goodbye.');
    setIsProfileOpen(false);
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#050715]/80 backdrop-blur-2xl flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

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
        <div className="relative group z-50">
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isSearchFocused ? 'text-primary-400' : 'text-slate-400'}`}>
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search leads or pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={() => {
              // Delay closing dropdown to allow clicking on results
              setTimeout(() => setIsSearchFocused(false), 200);
            }}
            className={`w-48 lg:w-72 bg-white/5 border rounded-xl pl-9 pr-12 py-2 text-sm text-white 
                       placeholder-slate-400 outline-none transition-all duration-300
                       ${isSearchFocused 
                         ? 'border-primary-500/50 shadow-[0_0_30px_rgba(59,130,246,0.05)] bg-white/10' 
                         : 'border-white/10 hover:border-white/20'
                       }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <kbd className="text-[10px] text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 font-mono">
              ⌘K
            </kbd>
          </div>

          {/* Search Dropdown */}
          {isSearchFocused && searchQuery.trim() !== '' && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0a0f24]/95 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden animate-scale-in">
              <div className="max-h-[350px] overflow-y-auto p-2 space-y-3">
                {/* Menu Options Section */}
                {filteredOptions.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1">
                      Menu Options
                    </div>
                    {filteredOptions.map((opt) => (
                      <button
                        key={opt.path}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigate(opt.path);
                          setSearchQuery('');
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition flex flex-col"
                      >
                        <span className="text-sm font-semibold text-white">{opt.name}</span>
                        <span className="text-xs text-slate-400">{opt.description}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Leads Section */}
                {filteredLeads.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 pt-2 border-t border-white/5">
                      Leads
                    </div>
                    {filteredLeads.map((lead) => (
                      <button
                        key={lead._id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          navigate(`/leads/edit/${lead._id}`);
                          setSearchQuery('');
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary-400">
                              {lead.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-white truncate">{lead.name}</div>
                            <div className="text-xs text-slate-400 truncate">{lead.email}</div>
                          </div>
                        </div>
                        <div className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                          {lead.status}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {filteredOptions.length === 0 && filteredLeads.length === 0 && (
                  <div className="text-center py-6 text-slate-400">
                    <p className="text-sm font-medium">No results for "{searchQuery}"</p>
                    <p className="text-xs mt-1">Try searching for another name, email, or page</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`p-2 rounded-xl transition relative group ${isNotificationsOpen ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-slate-400 hover:text-white'}`}
          >
            <Bell className="w-5 h-5 transition" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0a0f24]/95 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden z-50 animate-scale-in">
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-sm font-bold text-white">Notifications</span>
                <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">3 New</span>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2 divide-y divide-white/5">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-white/[0.02] transition rounded-xl flex flex-col gap-0.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${notif.type === 'success' ? 'bg-green-400' : 'bg-primary-400'}`} />
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-500">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{notif.desc}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-white/5 text-center">
                <button 
                  onClick={() => setIsNotificationsOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-white transition hover:bg-white/5 rounded-xl"
                >
                  Close Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions (Sparkles Button) */}
        <div className="relative" ref={quickActionsRef}>
          <button 
            onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
            className={`p-2 rounded-xl border transition group ${isQuickActionsOpen ? 'bg-primary-500/20 border-primary-500/30' : 'bg-gradient-to-r from-primary-500/10 to-primary-400/5 hover:from-primary-500/20 hover:to-primary-400/10 border-primary-500/10'}`}
          >
            <Sparkles className="w-5 h-5 text-primary-400 group-hover:scale-110 transition" />
          </button>

          {isQuickActionsOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0a0f24]/95 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden z-50 animate-scale-in">
              <div className="p-3 border-b border-white/5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Actions</span>
              </div>
              <div className="p-1.5 space-y-1">
                <button 
                  onClick={() => {
                    navigate('/leads/add');
                    setIsQuickActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-2.5 text-sm text-white"
                >
                  <Plus className="w-4 h-4 text-primary-400" />
                  Add New Lead
                </button>
                <button 
                  onClick={handleExportCSV}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-2.5 text-sm text-white"
                >
                  <FileSpreadsheet className="w-4 h-4 text-green-400" />
                  Export Leads CSV
                </button>
                <button 
                  onClick={() => {
                    navigate('/');
                    setIsQuickActionsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-2.5 text-sm text-white"
                >
                  <Zap className="w-4 h-4 text-yellow-400" />
                  View CRM Analytics
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition border border-white/5 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white transition" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0a0f24]/95 border border-white/10 shadow-2xl backdrop-blur-2xl overflow-hidden z-50 animate-scale-in">
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-400 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">Sultan Ansari</p>
                  <p className="text-xs text-slate-400 truncate">sultan@enterprise.com</p>
                </div>
              </div>
              <div className="p-1.5 space-y-1">
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-2.5 text-sm text-white"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Profile Settings
                </button>
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-white/5 transition flex items-center gap-2.5 text-sm text-white"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  Security Details
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition flex items-center gap-2.5 text-sm text-red-200 border-t border-white/5 pt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
