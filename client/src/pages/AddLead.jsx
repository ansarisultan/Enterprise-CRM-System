import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, User, Mail, Phone, Building, Tag, Upload } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { leadAPI } from '../services/api';
import toast from 'react-hot-toast';

const statusOptions = ['New', 'Contacted', 'Qualified', 'Won', 'Lost'];

const parseCSV = (text) => {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines.length <= 1) return [];
  
  const parseLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  return lines.slice(1).map(line => {
    const values = parseLine(line);
    const obj = {};
    headers.forEach((header, index) => {
      let mappedKey = header;
      if (header === 'fullname' || header === 'name') mappedKey = 'name';
      else if (header === 'emailaddress' || header === 'email') mappedKey = 'email';
      else if (header === 'phonenumber' || header === 'phone') mappedKey = 'phone';
      else if (header === 'companyname' || header === 'company') mappedKey = 'company';
      else if (header === 'status') mappedKey = 'status';
      
      obj[mappedKey] = values[index] || '';
    });
    return obj;
  });
};

export default function AddLead() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      await leadAPI.create(formData);
      toast.success('Lead created successfully! 🎉');
      navigate('/leads');
    } catch (error) {
      console.error('Error creating lead:', error);
      const errMsg = error.response?.data?.message || 'Failed to create lead';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result;
      if (typeof content !== 'string') return;

      setLoading(true);
      let importedLeads = [];

      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          importedLeads = Array.isArray(parsed) ? parsed : [parsed];
        } else if (file.name.endsWith('.csv')) {
          importedLeads = parseCSV(content);
        } else {
          toast.error('Unsupported file format. Please upload a JSON or CSV file.');
          setLoading(false);
          return;
        }

        if (importedLeads.length === 0) {
          toast.error('No leads found in the file.');
          setLoading(false);
          return;
        }

        const validLeads = importedLeads.map(lead => ({
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          company: lead.company || '',
          status: lead.status || 'New'
        })).filter(lead => lead.name.trim() && lead.email.trim());

        if (validLeads.length === 0) {
          toast.error('Could not find any valid leads with name and email.');
          setLoading(false);
          return;
        }

        await Promise.all(validLeads.map(lead => leadAPI.create(lead)));
        toast.success(`Successfully imported ${validLeads.length} leads! 🎉`);
        navigate('/leads');
      } catch (err) {
        console.error('Import error:', err);
        toast.error('Failed to parse and import file. Please check file format.');
      } finally {
        setLoading(false);
        e.target.value = '';
      }
    };

    reader.readAsText(file);
  };

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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/leads')}
            className="p-2 rounded-xl hover:bg-white/5 transition text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Add New Lead</h2>
            <p className="text-slate-400 mt-1">Create a new lead in your CRM</p>
          </div>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,.csv"
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleImportClick}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import File
          </Button>
        </div>
      </div>

      {/* Form */}
      <motion.div variants={item}>
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  Full Name *
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  error={errors.name}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Email Address *
                </label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  error={errors.email}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  Phone Number *
                </label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  error={errors.phone}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  Company
                </label>
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Inc."
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="glass-input"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <Button type="submit" disabled={loading} className="flex items-center gap-2 min-w-[120px]">
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Lead'}
              </Button>
              <Button 
                variant="secondary" 
                type="button"
                onClick={() => navigate('/leads')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}
