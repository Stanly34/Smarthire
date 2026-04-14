import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [p, a, m] = await Promise.all([
          api.get('/students/me'),
          api.get('/applications/my'),
          api.get('/students/matched-jobs'),
        ]);
        setProfile(p.data);
        setApplications(a.data);
        setMatchedJobs(m.data.slice(0, 5));
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data. Please refresh.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;
  if (error) return <Layout><div className="card text-center py-12 text-red-600">{error}</div></Layout>;

  const stats = [
    { label: 'Coding Score', value: profile?.coding_score || 0, icon: '💻', color: 'blue' },
    { label: 'Applications', value: applications.length, icon: '📋', color: 'purple' },
    { label: 'Matched Jobs', value: matchedJobs.length, icon: '🎯', color: 'green' },
    { label: 'CGPA', value: profile?.cgpa || 'N/A', icon: '🎓', color: 'yellow' },
  ];

  return (
    <Layout title={`Welcome, ${profile?.full_name || 'Student'} 👋`}>
      {/* Profile completion banner */}
      {!profile?.department && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="font-semibold text-yellow-800">Complete your profile</div>
            <div className="text-sm text-yellow-700">Add your skills and details to get better job matches.</div>
          </div>
          <Link to="/student/profile" className="btn-primary text-sm">Complete Profile</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className="text-3xl">{s.icon}</div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Matched Jobs */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Top Job Matches</h2>
            <Link to="/student/jobs" className="text-blue-600 text-sm hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {matchedJobs.length === 0 ? (
              <p className="text-gray-500 text-sm">Add skills to your profile to see matched jobs.</p>
            ) : (
              matchedJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.company_name}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${job.matchPercent >= 70 ? 'text-green-600' : job.matchPercent >= 40 ? 'text-yellow-600' : 'text-red-500'}`}>
                      {job.matchPercent}%
                    </div>
                    <div className="text-xs text-gray-400">match</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
            <Link to="/student/applications" className="text-blue-600 text-sm hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {applications.length === 0 ? (
              <p className="text-gray-500 text-sm">No applications yet. <Link to="/student/jobs" className="text-blue-600">Browse jobs →</Link></p>
            ) : (
              applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{app.title}</div>
                    <div className="text-xs text-gray-500">{app.company_name}</div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { to: '/student/profile', icon: '👤', label: 'Edit Profile' },
          { to: '/student/jobs', icon: '🔍', label: 'Find Jobs' },
          { to: '/student/coding', icon: '💻', label: 'Practice Coding' },
          { to: '/student/chat', icon: '💬', label: 'Messages' },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="card text-center hover:shadow-md transition-shadow cursor-pointer group">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{a.icon}</div>
            <div className="text-sm font-medium text-gray-700">{a.label}</div>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
