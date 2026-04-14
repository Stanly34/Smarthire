import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import SkillTag from '../../components/SkillTag';

export default function EligibleStudents() {
  const { jobId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/companies/eligible-students/${jobId}`)
      .then(res => setStudents(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load eligible students'))
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) return <Layout title="Eligible Students (AI Matched)"><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;
  if (error) return <Layout title="Eligible Students (AI Matched)"><div className="card text-center py-12 text-red-600">{error}</div></Layout>;

  return (
    <Layout title="Eligible Students (AI Matched)">
      <div className="mb-4 text-sm text-gray-500">{students.length} eligible student(s) found</div>
      {students.length === 0 ? (
        <div className="card text-center py-12 text-gray-500">No eligible students found for this job.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {students.map(s => (
            <div key={s.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{s.full_name}</h3>
                  <div className="text-sm text-gray-500">{s.email}</div>
                  <div className="text-sm text-gray-500">{s.department}</div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-extrabold ${s.matchPercent >= 80 ? 'text-green-600' : s.matchPercent >= 60 ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {s.matchPercent}%
                  </div>
                  <div className="text-xs text-gray-400">AI Match</div>
                </div>
              </div>

              {/* Match bar */}
              <div className="bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full ${s.matchPercent >= 80 ? 'bg-green-500' : s.matchPercent >= 60 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                  style={{ width: `${s.matchPercent}%` }}
                />
              </div>

              <div className="flex gap-4 text-sm mb-3">
                <span>CGPA: <strong>{s.cgpa || 'N/A'}</strong></span>
                <span>Coding: <strong>{s.coding_score}</strong></span>
              </div>
              <div className="flex flex-wrap gap-1">
                {s.skills?.map(sk => <SkillTag key={sk.id} name={sk.name} />)}
              </div>
              {s.resume_url && (
                <a href={s.resume_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-blue-600 text-sm hover:underline">📄 View Resume</a>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
