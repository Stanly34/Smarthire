import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([api.get('/admin/stats'), api.get('/admin/pending-users')]);
        setStats(s.data);
        setPending(p.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const approveUser = async (id) => {
    try {
      await api.put(`/admin/approve-user/${id}`);
      setPending(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve user');
    }
  };

  const rejectUser = async (id) => {
    try {
      await api.put(`/admin/reject-user/${id}`);
      setPending(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject user');
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;

  const statCards = [
    { label: 'Total Students', value: stats?.totalStudents, icon: '🎓', color: 'blue', to: '/admin/students' },
    { label: 'Total Companies', value: stats?.totalCompanies, icon: '🏢', color: 'purple', to: '/admin/companies' },
    { label: 'Jobs Posted', value: stats?.totalJobs, icon: '💼', color: 'green', to: '/admin/jobs' },
    { label: 'Applications', value: stats?.totalApplications, icon: '📋', color: 'yellow' },
    { label: 'Placements', value: stats?.totalPlacements, icon: '🎉', color: 'green' },
    { label: 'Placement Rate', value: `${stats?.placementRate}%`, icon: '📈', color: 'blue' },
  ];

  return (
    <Layout title="Admin Dashboard">
      {/* Pending Approvals */}
      {pending.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <h3 className="font-bold text-orange-800 mb-3">⏳ Pending Approvals ({pending.length})</h3>
          <div className="space-y-2">
            {pending.map(u => (
              <div key={u.id} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <span className="font-medium">{u.display_name}</span>
                  <span className="text-gray-500 text-sm ml-2">({u.email})</span>
                  <span className={`badge ml-2 ${u.role === 'student' ? 'badge-blue' : 'badge-yellow'}`}>{u.role}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveUser(u.id)} className="btn-success text-sm py-1 px-3">Approve</button>
                  <button onClick={() => rejectUser(u.id)} className="btn-danger text-sm py-1 px-3">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className={`card flex items-center gap-4 ${s.to ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
            onClick={() => s.to && (window.location.href = s.to)}>
            <div className="text-3xl">{s.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Top Skills Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Top Student Skills</h3>
          {stats?.topSkills?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.topSkills}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-8">No skill data yet</p>}
        </div>

        {/* Students per Department Pie */}
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Students by Department</h3>
          {stats?.studentsPerDept?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={stats.studentsPerDept} dataKey="count" nameKey="department" cx="50%" cy="50%" outerRadius={80} label={({ department, percent }) => `${department?.split(' ')[0]} ${(percent*100).toFixed(0)}%`}>
                  {stats.studentsPerDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-8">No department data yet</p>}
        </div>
      </div>

      {/* Jobs per Company */}
      <div className="card">
        <h3 className="text-lg font-bold mb-4">Jobs per Company</h3>
        {stats?.jobsPerCompany?.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.jobsPerCompany} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="company_name" type="category" width={150} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="job_count" fill="#10b981" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="text-gray-400 text-center py-8">No company data yet</p>}
      </div>
    </Layout>
  );
}
