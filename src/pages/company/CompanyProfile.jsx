import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

export default function CompanyProfile() {
  const [form, setForm] = useState({ company_name: '', industry: '', website: '', description: '', location: '', contact_person: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api.get('/companies/me')
      .then(res => {
        const d = res.data;
        setForm({
          company_name: d.company_name || '',
          industry: d.industry || '',
          website: d.website || '',
          description: d.description || '',
          location: d.location || '',
          contact_person: d.contact_person || '',
          phone: d.phone || '',
        });
      })
      .catch(err => setLoadError(err.response?.data?.message || 'Failed to load profile. Please refresh.'));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await api.put('/companies/me', form);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <Layout title="Company Profile"><div className="card text-center py-12 text-red-600">{loadError}</div></Layout>;

  return (
    <Layout title="Company Profile">
      <div className="max-w-2xl">
        <form onSubmit={handleSave} className="card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Company Name *</label>
              <input className="input" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} required />
            </div>
            <div>
              <label className="label">Industry</label>
              <select className="input" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}>
                <option value="">Select</option>
                {['Information Technology','Banking & Finance','Healthcare','E-Commerce','Manufacturing','Consulting','Startups','Product'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="City, Country" />
            </div>
            <div>
              <label className="label">Website</label>
              <input className="input" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://company.com" />
            </div>
            <div>
              <label className="label">Contact Person</label>
              <input className="input" value={form.contact_person} onChange={e => setForm({...form, contact_person: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="label">Phone</label>
              <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="label">Company Description</label>
              <textarea className="input" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Tell students about your company..." />
            </div>
          </div>
          {msg && (
            <div className={`p-3 rounded-lg text-sm ${msg.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg}</div>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</button>
        </form>
      </div>
    </Layout>
  );
}
