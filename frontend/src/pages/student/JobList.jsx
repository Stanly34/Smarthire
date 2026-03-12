import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import SkillTag from '../../components/SkillTag';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [matched, setMatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('matched'); // 'matched' | 'all'
  const [applying, setApplying] = useState(null);
  const [msg, setMsg] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [a, m] = await Promise.all([api.get('/jobs'), api.get('/students/matched-jobs')]);
        setJobs(a.data);
        setMatched(m.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const applyJob = async (jobId) => {
    setApplying(jobId);
    try {
      await api.post('/applications', { job_id: jobId });
      setMsg({ [jobId]: { type: 'success', text: 'Applied successfully!' } });
      setTimeout(() => setMsg(prev => { const n = {...prev}; delete n[jobId]; return n; }), 4000);
    } catch (err) {
      setMsg({ [jobId]: { type: 'error', text: err.response?.data?.message || 'Failed' } });
    } finally {
      setApplying(null);
    }
  };

  const displayJobs = (view === 'matched' ? matched : jobs).filter(j =>
    !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;

  return (
    <Layout title="Browse Jobs">
      {/* Tabs + Search */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button onClick={() => setView('matched')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'matched' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            🎯 Matched Jobs ({matched.length})
          </button>
          <button onClick={() => setView('all')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'all' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
            All Jobs ({jobs.length})
          </button>
        </div>
        <input
          className="input flex-1 min-w-[200px] max-w-xs"
          placeholder="Search jobs or companies..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {displayJobs.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">
          {view === 'matched' ? 'No matched jobs found. Add more skills to your profile.' : 'No jobs available.'}
        </div>
      ) : (
        <div className="grid gap-4">
          {displayJobs.map((job) => (
            <div key={job.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                    {job.matchPercent !== undefined && (
                      <span className={`badge text-xs font-bold ${job.matchPercent >= 70 ? 'badge-green' : job.matchPercent >= 40 ? 'badge-yellow' : 'badge-red'}`}>
                        {job.matchPercent}% match
                      </span>
                    )}
                    {job.eligible && <span className="badge badge-green">✓ Eligible</span>}
                  </div>
                  <div className="text-blue-600 font-semibold mb-2">{job.company_name}</div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                    {job.location && <span>📍 {job.location}</span>}
                    {job.salary_range && <span>💰 {job.salary_range}</span>}
                    {job.job_type && <span>⏰ {job.job_type}</span>}
                    {job.interview_date && <span>📅 Interview: {new Date(job.interview_date).toLocaleDateString()}</span>}
                  </div>
                  {job.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>}
                  <div className="flex flex-wrap gap-1">
                    {job.required_skills?.map(s => <SkillTag key={s.id} name={s.name} />)}
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    Min CGPA: {job.min_cgpa} · Min Coding Score: {job.min_coding_score}
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-w-[120px]">
                  {msg[job.id] ? (
                    <div className={`text-xs text-center px-2 py-1 rounded ${msg[job.id].type === 'success' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
                      {msg[job.id].text}
                    </div>
                  ) : (
                    <button
                      onClick={() => applyJob(job.id)}
                      disabled={applying === job.id}
                      className="btn-primary text-sm"
                    >
                      {applying === job.id ? 'Applying...' : 'Apply Now'}
                    </button>
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
