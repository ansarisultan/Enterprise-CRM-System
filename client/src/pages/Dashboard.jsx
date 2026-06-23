import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX,
  TrendingUp,
  TrendingDown,
  Zap,
  Sparkles
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { leadAPI } from '../services/api';
import StatusBadge from '../components/leads/StatusBadge';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await leadAPI.getAll();
      const data = response.data;
      setLeads(data);

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
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.total,
      icon: Users,
      color: 'text-primary-400',
      bg: 'bg-primary-500/10',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'New Leads',
      value: stats.new,
      icon: UserPlus,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Won Deals',
      value: stats.won,
      icon: UserCheck,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      trend: '+23%',
      trendUp: true,
    },
    {
      title: 'Lost Deals',
      value: stats.lost,
      icon: UserX,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      trend: '-5%',
      trendUp: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back! 👋</h2>
          <p className="text-slate-400 mt-1">Here's what's happening with your leads today.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Last updated: Today</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <GlassCard className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="stat-label">{stat.title}</p>
                  <p className="stat-number mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.trend}
                </span>
                {stat.trendUp ? (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span className="text-xs text-slate-400">vs last month</span>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Recent Leads Preview */}
      <motion.div variants={item}>
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">Recent Leads</h3>
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
                  <th className="text-left py-3 px-2 font-medium">Name</th>
                  <th className="text-left py-3 px-2 font-medium">Email</th>
                  <th className="text-left py-3 px-2 font-medium">Company</th>
                  <th className="text-left py-3 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((lead) => (
                  <tr key={lead._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3 px-2 text-sm text-white">{lead.name}</td>
                    <td className="py-3 px-2 text-sm text-slate-300">{lead.email}</td>
                    <td className="py-3 px-2 text-sm text-slate-300">{lead.company || '-'}</td>
                    <td className="py-3 px-2">
                      <StatusBadge status={lead.status} />
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                      No leads yet. Start by adding your first lead!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
