import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate(`/${res.data.user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-blue-600">SmartHire</Link>
          <p className="text-gray-500 mt-2">Welcome back! Sign in to continue.</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sign In</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="admin@smarthire.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="admin123"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 space-y-2 text-sm text-center text-gray-500">
            <p>Don't have an account?</p>
            <div className="flex gap-4 justify-center">
              <Link to="/register/student" className="text-blue-600 hover:underline font-medium">Register as Student</Link>
              <span>.</span>
              <Link to="/register/company" className="text-blue-600 hover:underline font-medium">Register as Company</Link>
            </div>
          </div>
          <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
            <div className="font-semibold mb-1">Demo Credentials</div>
            <div>Admin: admin@smarthire.com / admin123</div>
            <div>Student: arjun.sharma@student.com / demo123</div>
            <div>Company: infosys@hire.com / company123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
