import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX,
  TrendingUp,
  TrendingDown,
  Zap,
  Sparkles,
  Activity,
  BarChart3,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Circle,
  Square,
  Triangle
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { leadAPI, getDbStatus } from '../services/api';
import StatusBadge from '../components/leads/StatusBadge';

// 3D Floating Shapes Component
const FloatingShapes = () => {
  const shapes = [
    { Icon: Circle, x: 10, y: 20, size: 12, delay: 0, duration: 8 },
    { Icon: Square, x: 85, y: 15, size: 10, delay: 2, duration: 6 },
    { Icon: Triangle, x: 90, y: 80, size: 14, delay: 4, duration: 10 },
    { Icon: Circle, x: 5, y: 70, size: 8, delay: 1, duration: 7 },
    { Icon: Square, x: 50, y: 5, size: 6, delay: 3, duration: 9 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, idx) => (
        <div
          key={idx}
          className="absolute opacity-[0.03]"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            animation: `float ${shape.duration}s ease-in-out ${shape.delay}s infinite`,
          }}
        >
          <shape.Icon className={`w-${shape.size} h-${shape.size} text-primary-400`} />
        </div>
      ))}
    </div>
  );
};

// Glowing Orb Component
const GlowingOrb = ({ color, size, x, y, delay }) => (
  <div
    className="absolute rounded-full blur-3xl animate-float-slow"
    style={{
      width: size,
      height: size,
      background: `radial-gradient(circle, ${color}, transparent)`,
      left: `${x}%`,
      top: `${y}%`,
      animationDelay: `${delay}s`,
      opacity: 0.3,
    }}
  />
);

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    won: 0,
    lost: 0,
  });
  const [dbStatus, setDbStatus] = useState({ isOffline: false, apiUrl: '' });
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await leadAPI.getAll();
      const data = response.data;
      setLeads(data);
      setDbStatus(getDbStatus());

      const stats = {
        total: data.length,
        new: data.filter(l => l.status === 'New').length,
        contacted: data.filter(l => l.status === 'Contacted').length,
        won: data.filter(l => l.status === 'Won').length,
        lost: data.filter(l => l.status === 'Lost').length,
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setDbStatus(getDbStatus());
    } finally {
      setLoading(false);
    }
  };

  const calculateTrend = (leadsList, filterFn = () => true) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const filtered = leadsList.filter(filterFn);
    const recent = filtered.filter(l => new Date(l.createdAt) >= sevenDaysAgo).length;
    const previous = filtered.filter(l => {
      const d = new Date(l.createdAt);
      return d >= fourteenDaysAgo && d < sevenDaysAgo;
    }).length;

    if (previous > 0) {
      const diff = ((recent - previous) / previous) * 100;
      return {
        trend: `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`,
        trendUp: diff >= 0
      };
    } else if (recent > 0) {
      return {
        trend: `+${recent} new`,
        trendUp: true
      };
    }
    return {
      trend: '0%',
      trendUp: true
    };
  };

  const totalTrend = calculateTrend(leads);
  const newTrend = calculateTrend(leads, l => l.status === 'New');
  const wonTrend = calculateTrend(leads, l => l.status === 'Won');
  const lostTrend = calculateTrend(leads, l => l.status === 'Lost');

  const getWeeklyActivity = () => {
    const dayCounts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    leads.forEach(lead => {
      if (lead.createdAt) {
        const dayName = new Date(lead.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
        if (dayCounts[dayName] !== undefined) {
          dayCounts[dayName]++;
        }
      }
    });
    const maxCount = Math.max(...Object.values(dayCounts), 1);
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      count: dayCounts[day],
      height: Math.max(10, (dayCounts[day] / maxCount) * 100)
    }));
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.total,
      icon: Users,
      color: 'text-primary-400',
      bg: 'from-primary-500/20 to-primary-400/10',
      trend: totalTrend.trend,
      trendUp: totalTrend.trendUp,
      gradient: 'from-primary-500/10 to-primary-400/5',
    },
    {
      title: 'New Leads',
      value: stats.new,
      icon: UserPlus,
      color: 'text-blue-400',
      bg: 'from-blue-500/20 to-blue-400/10',
      trend: newTrend.trend,
      trendUp: newTrend.trendUp,
      gradient: 'from-blue-500/10 to-blue-400/5',
    },
    {
      title: 'Won Deals',
      value: stats.won,
      icon: UserCheck,
      color: 'text-green-400',
      bg: 'from-green-500/20 to-green-400/10',
      trend: wonTrend.trend,
      trendUp: wonTrend.trendUp,
      gradient: 'from-green-500/10 to-green-400/5',
    },
    {
      title: 'Lost Deals',
      value: stats.lost,
      icon: UserX,
      color: 'text-red-400',
      bg: 'from-red-500/20 to-red-400/10',
      trend: lostTrend.trend,
      trendUp: lostTrend.trendUp,
      gradient: 'from-red-500/10 to-red-400/5',
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin mx-auto" />
            <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-primary-500/10 animate-ping mx-auto" />
          </div>
          <p className="text-slate-400 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 relative"
    >
      {/* Dynamic Background Elements */}
      <GlowingOrb color="rgba(59,130,246,0.3)" size="600px" x={-10} y={-10} delay={0} />
      <GlowingOrb color="rgba(96,165,250,0.2)" size="400px" x={80} y={20} delay={2} />
      <GlowingOrb color="rgba(59,130,246,0.15)" size="300px" x={40} y={70} delay={4} />
      <FloatingShapes />

      {/* Welcome Section */}
      <motion.div variants={item} className="relative">
        <div className="glass-premium p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-500/5 rounded-full blur-3xl animate-float-medium" style={{ animationDelay: '-2s' }} />
          
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, Sultan! 👋
              </h1>
              <p className="text-slate-400 mt-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-400" />
                Here's what's happening with your leads today
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {dbStatus.isOffline ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-semibold">Demo Mode (Offline)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-semibold">Connected to MongoDB</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">API URL:</span>
                <code className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5">{dbStatus.apiUrl || 'http://localhost:5000/api'}</code>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards - 3D Premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <div className="stat-3d group">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bg} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-100 transition duration-500`} />
              
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="stat-label text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-4xl font-bold text-white mt-2 tracking-tight">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <span className={`text-sm font-medium ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trend}
                </span>
                {stat.trendUp ? (
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span className="text-xs text-slate-400 ml-1">vs last month</span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000`}
                  style={{ width: `${Math.min((stat.value / 1000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Chart Placeholder */}
      <motion.div variants={item}>
        <div className="glass-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-400" />
                Lead Activity
              </h3>
              <p className="text-sm text-slate-400">Weekly lead distribution</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 transition text-slate-400 hover:text-white">
                Week
              </button>
              <button className="px-3 py-1.5 text-xs rounded-lg bg-primary-500/20 text-primary-400 border border-primary-500/20">
                Month
              </button>
              <button className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 transition text-slate-400 hover:text-white">
                Year
              </button>
            </div>
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end justify-between h-32 gap-2">
            {getWeeklyActivity().map(({ day, count, height }) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full flex flex-col items-center justify-end h-full">
                  <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap shadow-xl border border-white/10 font-medium">
                    {count} {count === 1 ? 'lead' : 'leads'}
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-primary-500/30 to-primary-400/20 rounded-lg transition-all duration-500 group-hover:from-primary-500/50 group-hover:to-primary-400/30"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Leads */}
      <motion.div variants={item}>
        <div className="glass-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary-400" />
                Recent Leads
              </h3>
              <p className="text-sm text-slate-400">Your latest 5 leads</p>
            </div>
            <button className="text-sm text-primary-400 hover:text-primary-300 transition flex items-center gap-1">
              View All
              <Sparkles className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-white/5">
                  <th className="text-left py-3 px-3 font-medium">Lead</th>
                  <th className="text-left py-3 px-3 font-medium">Email</th>
                  <th className="text-left py-3 px-3 font-medium">Company</th>
                  <th className="text-left py-3 px-3 font-medium">Status</th>
                  <th className="text-right py-3 px-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((lead, idx) => (
                  <motion.tr
                    key={lead._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition group"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-400/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-primary-400">
                            {lead.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-white group-hover:text-primary-400 transition">
                          {lead.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-sm text-slate-300">{lead.email}</td>
                    <td className="py-3 px-3 text-sm text-slate-300">{lead.company || '-'}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-3 px-3 text-right text-xs text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400">
                      <Zap className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                      <p className="text-lg font-medium">No leads yet</p>
                      <p className="text-sm mt-1">Start by adding your first lead</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
