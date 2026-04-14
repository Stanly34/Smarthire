import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';

export default function CompanyDashboard() {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, j] = await Promise.all([api.get('/companies/me'), api.get('/jobs/company/mine')]);
        setProfile(p.data);
        setJobs(j.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;

  const totalApps = jobs.reduce((s, j) => s + parseInt(j.application_count || 0), 0);
  const openJobs = jobs.filter(j => j.status === 'open').length;

  return (
    <Layout title={`${profile?.company_name || 'Company'} Dashboard`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Jobs Posted', value: jobs.length, icon: '💼' },
          { label: 'Open Jobs', value: openJobs, icon: '🟢' },
          { label: 'Total Applications', value: totalApps, icon: '📋' },
          { label: 'Industry', value: profile?.industry || 'N/A', icon: '🏭' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className="text-3xl">{s.icon}</div>
            <div>
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link to="/company/post-job" className="card text-center hover:shadow-md transition-shadow group">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</div>
          <div className="font-semibold">Post a Job</div>
        </Link>
        <Link to="/company/profile" className="card text-center hover:shadow-md transition-shadow group">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏢</div>
          <div className="font-semibold">Edit Profile</div>
        </Link>
        <Link to="/company/chat" className="card text-center hover:shadow-md transition-shadow group">
          <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💬</div>
          <div className="font-semibold">Messages</div>
        </Link>
      </div>

      {/* My Jobs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">My Job Postings</h2>
          <Link to="/company/post-job" className="btn-primary text-sm">+ Post New Job</Link>
        </div>
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No jobs posted yet. <Link to="/company/post-job" className="text-blue-600">Post your first job →</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500 border-b">
                <tr>
                  <th className="pb-3">Job Title</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Applications</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td className="py-3 font-medium">{job.title}</td>
                    <td className="py-3 text-gray-500">{job.location || '—'}</td>
                    <td className="py-3">{job.application_count || 0}</td>
                    <td className="py-3"><StatusBadge status={job.status} /></td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Link to={`/company/applicants/${job.id}`} className="text-blue-600 hover:underline">Applicants</Link>
                        <Link to={`/company/eligible/${job.id}`} className="text-green-600 hover:underline">Eligible</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
