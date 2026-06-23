import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { leadAPI } from '../services/api';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AddLead() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'New',
  });
  
  const [errors, setErrors] = useState({});

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

    setLoading(true);
    try {
      await leadAPI.create(formData);
      toast.success('Lead created successfully!');
      navigate('/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error(error.response?.data?.message || 'Failed to create lead. Please check the server.');
    } finally {
      setLoading(false);
    }
  };

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
              <UserPlus className="w-6 h-6 text-primary-400" />
              Add Lead
            </h2>
            <p className="text-slate-400 mt-1">Register a new prospective client.</p>
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
            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              {loading ? 'Creating...' : 'Create Lead'}
            </Button>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
}
