import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import SkillTag from '../../components/SkillTag';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(res => setApplications(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;

  return (
    <Layout title="My Applications">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { status: 'applied', label: 'Applied', color: 'blue' },
          { status: 'shortlisted', label: 'Shortlisted', color: 'yellow' },
          { status: 'selected', label: 'Selected', color: 'green' },
          { status: 'rejected', label: 'Rejected', color: 'red' },
        ].map(s => (
          <div key={s.status} className="card text-center">
            <div className="text-2xl font-bold text-gray-900">{statusCounts[s.status] || 0}</div>
            <div className="text-sm text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          You haven't applied to any jobs yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map(app => (
            <div key={app.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{app.title}</h3>
                  <div className="text-blue-600 font-medium mb-2">{app.company_name}</div>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
                    {app.location && <span>📍 {app.location}</span>}
                    {app.salary_range && <span>💰 {app.salary_range}</span>}
                    {app.job_type && <span>⏰ {app.job_type}</span>}
                    {app.interview_date && (
                      <span className="text-blue-600 font-medium">📅 Interview: {new Date(app.interview_date).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {app.required_skills?.map(s => <SkillTag key={s.id} name={s.name} />)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={app.status} />
                  <div className="text-xs text-gray-400">
                    Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '—'}
                  </div>
                  {app.status === 'selected' && (
                    <div className="text-green-600 text-sm font-semibold animate-pulse">🎉 Congratulations!</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
