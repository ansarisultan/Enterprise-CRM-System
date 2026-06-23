import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Edit3, ArrowLeft, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { leadAPI } from '../services/api';

export default function EditLead() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    setFetching(true);
    try {
      const response = await leadAPI.getOne(id);
      const lead = response.data;
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'New',
      });
    } catch (error) {
      console.error('Error fetching lead:', error);
      toast.error('Failed to load lead details.');
      navigate('/leads');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await leadAPI.update(id, formData);
      toast.success('Lead updated successfully!');
      navigate('/leads');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error(error.response?.data?.message || 'Failed to update lead. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading lead details...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/leads">
            <Button variant="secondary" className="p-2.5 px-3 border border-white/5 bg-white/5 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Edit3 className="w-6 h-6 text-primary-400" />
              Edit Lead
            </h2>
            <p className="text-slate-400 mt-1">Modify lead information parameters.</p>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <GlassCard className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              error={errors.name}
              required
            />
            
            <Input
              label="Email Address *"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. john@example.com"
              error={errors.email}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 (555) 019-2834"
            />
            
            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Stripe, Inc."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">
              Lead Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="glass-input"
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Link to="/leads">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={saving} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
}
