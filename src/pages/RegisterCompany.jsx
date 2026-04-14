import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function RegisterCompany() {
  const [form, setForm] = useState({ email: '', password: '', company_name: '', industry: '', website: '', location: '', contact_person: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register-company', form);
      setSuccess('Registration successful! Please wait for admin approval before logging in.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-extrabold text-blue-600">SmartHire</Link>
          <p className="text-gray-500 mt-2">Register your company</p>
        </div>
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Company Registration</h2>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
          {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Company Name *</label>
                <input className="input" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} required placeholder="Acme Corp" />
              </div>
              <div className="col-span-2">
                <label className="label">Email Address *</label>
                <input type="email" className="input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="hr@company.com" />
              </div>
              <div className="col-span-2">
                <label className="label">Password *</label>
                <input type="password" className="input" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
              </div>
              <div>
                <label className="label">Industry</label>
                <select className="input" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}>
                  <option value="">Select</option>
                  {['Information Technology', 'Banking & Finance', 'Healthcare', 'E-Commerce', 'Manufacturing', 'Consulting', 'Startups', 'Product'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Bangalore, India" />
              </div>
              <div>
                <label className="label">Website</label>
                <input className="input" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://company.com" />
              </div>
              <div>
                <label className="label">Contact Person</label>
                <input className="input" value={form.contact_person} onChange={e => setForm({...form, contact_person: e.target.value})} placeholder="HR Manager" />
              </div>
              <div className="col-span-2">
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+91 9876543210" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
              {loading ? 'Registering...' : 'Register Company'}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
