import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Users,
  Zap,
  Sparkles,
  Download
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import StatusBadge from '../components/leads/StatusBadge';
import { leadAPI } from '../services/api';
import toast from 'react-hot-toast';

const statusOptions = ['All', 'New', 'Contacted', 'Qualified', 'Won', 'Lost'];

export default function Leads() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedLeads, setSelectedLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await leadAPI.getAll();
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated) {
      toast.error('Admin authentication required to delete leads');
      navigate('/login');
      return;
    }
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadAPI.delete(id);
        setLeads(leads.filter(lead => lead._id !== id));
        toast.success('Lead deleted successfully!');
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!isAuthenticated) {
      toast.error('Admin authentication required to delete leads');
      navigate('/login');
      return;
    }
    if (selectedLeads.length === 0) {
      toast.error('Please select leads to delete');
      return;
    }

    if (window.confirm(`Delete ${selectedLeads.length} leads?`)) {
      try {
        await Promise.all(selectedLeads.map(id => leadAPI.delete(id)));
        setLeads(leads.filter(lead => !selectedLeads.includes(lead._id)));
        setSelectedLeads([]);
        toast.success(`${selectedLeads.length} leads deleted successfully!`);
      } catch (error) {
        console.error('Error deleting leads:', error);
        toast.error('Failed to delete leads');
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const toggleSelect = (id) => {
    setSelectedLeads(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead._id));
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Leads</h2>
          <p className="text-slate-400 mt-1">Manage and track your leads</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/leads/add">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Lead
            </Button>
          </Link>
          {selectedLeads.length > 0 && (
            <Button variant="danger" onClick={handleBulkDelete} className="flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete ({selectedLeads.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input pl-9"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="glass-input w-40 flex-shrink-0"
        >
          {statusOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <Button 
          variant="secondary" 
          className="flex items-center gap-2 flex-shrink-0"
          onClick={() => {
            setSearchTerm('');
            setStatusFilter('All');
          }}
        >
          <Filter className="w-4 h-4" />
          Reset
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-white">{filteredLeads.length}</div>
          <div className="text-xs text-slate-400">Total Leads</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {filteredLeads.filter(l => l.status === 'New').length}
          </div>
          <div className="text-xs text-slate-400">New</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {filteredLeads.filter(l => l.status === 'Won').length}
          </div>
          <div className="text-xs text-slate-400">Won</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold text-red-400">
            {filteredLeads.filter(l => l.status === 'Lost').length}
          </div>
          <div className="text-xs text-slate-400">Lost</div>
        </GlassCard>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 border-b border-white/5 bg-white/5">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-white/10 bg-dark-700 accent-primary-500"
                  />
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:text-white transition group"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:text-white transition group"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email
                    {sortField === 'email' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:text-white transition group"
                  onClick={() => handleSort('company')}
                >
                  <div className="flex items-center gap-1">
                    Company
                    {sortField === 'company' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:text-white transition group"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400">
                    <Zap className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                    <p className="text-lg font-medium">No leads found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or add a new lead</p>
                    <Link to="/leads/add" className="inline-block mt-4">
                      <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Lead
                      </Button>
                    </Link>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead._id}
                    variants={item}
                    className={`border-b border-white/5 hover:bg-white/5 transition ${selectedLeads.includes(lead._id) ? 'bg-primary-500/5' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => toggleSelect(lead._id)}
                        className="rounded border-white/10 bg-dark-700 accent-primary-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/20 to-primary-400/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-primary-400">
                            {lead.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-white">{lead.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">{lead.email}</td>
                    <td className="py-3 px-4 text-sm text-slate-300">{lead.company || '-'}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/leads/edit/${lead._id}`}
                          className="p-1.5 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 transition text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
          <span>Showing {filteredLeads.length} of {leads.length} leads</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg hover:bg-white/5 transition">Previous</button>
            <span className="px-3 py-1 rounded-lg bg-primary-500/20 text-primary-400">1</span>
            <button className="px-3 py-1 rounded-lg hover:bg-white/5 transition">Next</button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
