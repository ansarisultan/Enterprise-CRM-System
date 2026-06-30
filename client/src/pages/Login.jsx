import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldAlert, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error('Please enter the admin password');
      return;
    }

    setLoading(true);
    const result = await login(password);
    setLoading(false);

    if (result.success) {
      toast.success('Authenticated as Sultan Ansari!');
      navigate('/');
    } else {
      toast.error(result.message || 'Invalid admin password');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center relative">
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-premium p-8 w-full max-w-md relative overflow-hidden text-center">
        {/* Glow Top Right */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />

        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-400/10 flex items-center justify-center mx-auto mb-6 border border-primary-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
          <ShieldAlert className="w-8 h-8 text-primary-400" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Admin Authentication</h2>
        <p className="text-sm text-slate-400 mb-6">
          Authorized access required to add, modify, or delete leads. Enter password to login as <span className="text-primary-400 font-semibold">Sultan Ansari</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <KeyRound className="w-4 h-4" />
            </span>
            <input
              type="password"
              placeholder="Enter admin password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-premium pl-10"
              disabled={loading}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-premium flex items-center justify-center gap-2 mt-2"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Unlock Admin Mode'}
          </button>
        </form>
      </div>
    </div>
  );
}
