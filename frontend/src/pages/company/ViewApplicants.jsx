import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import SkillTag from '../../components/SkillTag';

export default function ViewApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get(`/applications/job/${jobId}`)
      .then(res => setApplicants(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      await api.put(`/applications/${appId}/status`, { status });
      setApplicants(prev => prev.map(a => a.application_id === appId ? { ...a, status } : a));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;

  return (
    <Layout title="Job Applicants">
      <div className="mb-4 text-sm text-gray-500">{applicants.length} applicant(s)</div>
      {applicants.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">No applications received yet.</div>
      ) : (
        <div className="space-y-4">
          {applicants.map(app => (
            <div key={app.application_id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900">{app.full_name}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="text-sm text-gray-500 mb-2">{app.email} · {app.department}</div>
                  <div className="flex gap-4 text-sm mb-2">
                    <span>CGPA: <strong>{app.cgpa || 'N/A'}</strong></span>
                    <span>Coding Score: <strong>{app.coding_score}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {app.skills?.map(s => <SkillTag key={s.id} name={s.name} />)}
                  </div>
                  {app.resume_url && (
                    <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">📄 View Resume</a>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-xs text-gray-400">Applied: {new Date(app.applied_at).toLocaleDateString()}</div>
                  <select
                    className="input text-sm"
                    value={app.status}
                    onChange={e => updateStatus(app.application_id, e.target.value)}
                    disabled={updating === app.application_id}
                  >
                    {['applied','shortlisted','rejected','selected'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
