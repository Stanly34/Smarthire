import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import SkillTag from '../../components/SkillTag';

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/students')
      .then(res => setStudents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleApproval = async (userId, isApproved) => {
    try {
      const endpoint = isApproved ? `/admin/reject-user/${userId}` : `/admin/approve-user/${userId}`;
      await api.put(endpoint);
      setStudents(prev => prev.map(s => s.user_id === userId ? { ...s, is_approved: !isApproved } : s));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update approval status');
    }
  };

  const filtered = students.filter(s =>
    !search || s.full_name?.toLowerCase().includes(search.toLowerCase()) || s.email?.toLowerCase().includes(search.toLowerCase()) || s.department?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;

  return (
    <Layout title={`Manage Students (${students.length})`}>
      <div className="mb-4">
        <input className="input max-w-sm" placeholder="Search by name, email, department..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">CGPA</th>
                <th className="px-4 py-3">Coding</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{s.full_name}</td>
                  <td className="px-4 py-3 text-gray-500">{s.email}</td>
                  <td className="px-4 py-3 text-gray-500">{s.department || '—'}</td>
                  <td className="px-4 py-3">{s.cgpa || '—'}</td>
                  <td className="px-4 py-3">{s.coding_score}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {s.skills?.slice(0, 3).map(sk => <SkillTag key={sk.id} name={sk.name} />)}
                      {s.skills?.length > 3 && <span className="badge badge-gray">+{s.skills.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${s.is_approved ? 'badge-green' : 'badge-yellow'}`}>
                      {s.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleApproval(s.user_id, s.is_approved)}
                      className={`text-xs px-2 py-1 rounded font-medium ${s.is_approved ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {s.is_approved ? 'Suspend' : 'Approve'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-500">No students found</div>}
        </div>
      </div>
    </Layout>
  );
}
