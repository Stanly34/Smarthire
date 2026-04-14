import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

export default function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/companies')
      .then(res => setCompanies(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleApproval = async (userId, isApproved) => {
    try {
      const endpoint = isApproved ? `/admin/reject-user/${userId}` : `/admin/approve-user/${userId}`;
      await api.put(endpoint);
      setCompanies(prev => prev.map(c => c.user_id === userId ? { ...c, is_approved: !isApproved } : c));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update approval status');
    }
  };

  const filtered = companies.filter(c =>
    !search || c.company_name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;

  return (
    <Layout title={`Manage Companies (${companies.length})`}>
      <div className="mb-4">
        <input className="input max-w-sm" placeholder="Search by company name or email..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Industry</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Jobs</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{c.company_name}</div>
                    {c.website && <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">Website</a>}
                  </td>
                  <td className="px-4 py-3 text-gray-500">{c.email}</td>
                  <td className="px-4 py-3 text-gray-500">{c.industry || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{c.location || '—'}</td>
                  <td className="px-4 py-3">{c.job_count || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${c.is_approved ? 'badge-green' : 'badge-yellow'}`}>
                      {c.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleApproval(c.user_id, c.is_approved)}
                      className={`text-xs px-2 py-1 rounded font-medium ${c.is_approved ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {c.is_approved ? 'Suspend' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-500">No companies found</div>}
        </div>
      </div>
    </Layout>
  );
}
