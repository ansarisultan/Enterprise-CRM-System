import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Users, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import SearchBar from '../components/leads/SearchBar';
import LeadTable from '../components/leads/LeadTable';
import { leadAPI } from '../services/api';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await leadAPI.getAll();
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    
    const resolvePromise = leadAPI.delete(id);
    await toast.promise(resolvePromise, {
      loading: 'Deleting lead...',
      success: 'Lead deleted successfully!',
      error: 'Failed to delete lead.',
    });

    // Refresh leads list
    fetchLeads(true);
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-400" />
            Leads Database
          </h2>
          <p className="text-slate-400 mt-1">Manage and track your customer leads.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={() => fetchLeads(false)}
            className="p-2.5 px-3 border border-white/5 bg-white/5 hover:bg-white/10"
            title="Refresh Leads"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Link to="/leads/add">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & filters */}
      <motion.div variants={item}>
        <GlassCard className="p-4 sm:p-5">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </GlassCard>
      </motion.div>

      {/* Main Leads Table */}
      <motion.div variants={item}>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading leads...</p>
            </div>
          </div>
        ) : (
          <LeadTable leads={filteredLeads} onDelete={handleDelete} />
        )}
      </motion.div>
    </motion.div>
  );
}
