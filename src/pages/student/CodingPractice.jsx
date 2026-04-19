import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const DIFFICULTY_COLOR = { beginner: 'badge-green', intermediate: 'badge-yellow', advanced: 'badge-red' };
const LANGUAGE_ORDER = ['C++', 'Java', 'JavaScript', 'Python', 'C', 'C#', 'Go', 'TypeScript', 'PHP', 'Rust'];
const CODE_PLACEHOLDER_BY_LANGUAGE = {
  'C++': '// Write your C++ code here...\n\n',
  Java: '// Write your Java code here...\n\n',
  JavaScript: '// Write your JavaScript code here...\n\n',
  Python: '# Write your Python code here...\n\n',
  C: '// Write your C code here...\n\n',
  'C#': '// Write your C# code here...\n\n',
  Go: '// Write your Go code here...\n\n',
  TypeScript: '// Write your TypeScript code here...\n\n',
  PHP: "<?php\n// Write your PHP code here...\n\n",
  Rust: '// Write your Rust code here...\n\n',
};

export default function CodingPractice() {
  const [problems, setProblems] = useState([]);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('practice');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [filter, setFilter] = useState({ difficulty: '', language: '' });
  const [tab, setTab] = useState('problems'); // 'problems' | 'results'

  useEffect(() => {
    const load = async () => {
      try {
        const [p, r] = await Promise.all([api.get('/coding/problems'), api.get('/coding/results/me')]);
        setProblems(p.data);
        setResults(r.data);
      } catch (err) {
        console.error('Failed to load coding data:', err);
      }
    };
    load();
  }, []);

  const handleSelect = (problem) => {
    setSelected(problem);
    setCode('');
    setFeedback(null);
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await api.post('/coding/submit', {
        problem_id: selected.id,
        submitted_code: code,
        mode,
        language: selected.language,
      });
      setFeedback(res.data);
      // refresh results
      const r = await api.get('/coding/results/me');
      setResults(r.data);
    } catch (err) {
      setFeedback({ passed: false, message: err.response?.data?.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = problems.filter(p =>
    (!filter.difficulty || p.difficulty === filter.difficulty) &&
    (!filter.language || p.language === filter.language)
  );
  const languageOptions = [...new Set(problems.map(problem => problem.language).filter(Boolean))].sort((left, right) => {
    const leftIndex = LANGUAGE_ORDER.indexOf(left);
    const rightIndex = LANGUAGE_ORDER.indexOf(right);
    const normalizedLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const normalizedRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

    if (normalizedLeft !== normalizedRight) return normalizedLeft - normalizedRight;
    return left.localeCompare(right);
  });
  const codePlaceholder = selected ? (CODE_PLACEHOLDER_BY_LANGUAGE[selected.language] || `// Write your ${selected.language} code here...\n\n`) : '';

  return (
    <Layout title="Coding Practice">
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab('problems')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'problems' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          💻 Problems
        </button>
        <button onClick={() => setTab('results')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          📊 My Results ({results.length})
        </button>
      </div>

      {tab === 'results' ? (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Submission History</h3>
          {results.length === 0 ? <p className="text-gray-500">No submissions yet.</p> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 border-b">
                  <tr>
                    <th className="pb-2">Problem</th>
                    <th className="pb-2">Difficulty</th>
                    <th className="pb-2">Mode</th>
                    <th className="pb-2">Score</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map(r => (
                    <tr key={r.id}>
                      <td className="py-2 font-medium">{r.title}</td>
                      <td className="py-2 capitalize">{r.difficulty}</td>
                      <td className="py-2 capitalize">{r.mode}</td>
                      <td className="py-2"><span className={`badge ${r.score >= 70 ? 'badge-green' : 'badge-red'}`}>{r.score}</span></td>
                      <td className="py-2 text-gray-500">{new Date(r.submitted_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Problem list */}
          <div className="lg:col-span-2">
            <div className="card mb-4">
              <div className="flex gap-2">
                <select className="input text-sm" value={filter.difficulty} onChange={e => setFilter({...filter, difficulty: e.target.value})}>
                  <option value="">All Levels</option>
                  {['beginner','intermediate','advanced'].map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
                </select>
                <select className="input text-sm" value={filter.language} onChange={e => setFilter({...filter, language: e.target.value})}>
                  <option value="">All Languages</option>
                  {languageOptions.map(language => <option key={language}>{language}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              {filtered.length === 0 ? (
                <div className="card text-sm text-gray-500">No coding tasks match the selected filters.</div>
              ) : (
                filtered.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${selected?.id === p.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                  >
                    <div className="font-medium text-sm">{p.title}</div>
                    <div className="flex gap-2 mt-1">
                      <span className={`badge text-xs ${DIFFICULTY_COLOR[p.difficulty]}`}>{p.difficulty}</span>
                      <span className="badge badge-gray text-xs">{p.language}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="lg:col-span-3">
            {!selected ? (
              <div className="card h-full flex items-center justify-center text-gray-400 text-center py-20">
                Select a problem from the list to start coding
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{selected.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`badge ${DIFFICULTY_COLOR[selected.difficulty]}`}>{selected.difficulty}</span>
                      <span className="badge badge-gray">{selected.language}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <button onClick={() => setMode('practice')} className={`px-3 py-1 rounded-lg transition-colors ${mode === 'practice' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}>Practice</button>
                    <button onClick={() => setMode('score')} className={`px-3 py-1 rounded-lg transition-colors ${mode === 'score' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Scored</button>
                  </div>
                </div>

                {mode === 'score' && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-2 rounded mb-3">
                    Score mode: Your result will be saved and visible to companies.
                  </div>
                )}

                <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 mb-2">{selected.description}</p>
                  <div className="text-xs text-gray-500">
                    <span className="font-semibold">Sample Input:</span> {selected.sample_input}<br />
                    <span className="font-semibold">Sample Output:</span> {selected.sample_output}
                  </div>
                </div>

                <textarea
                  className="w-full font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={14}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder={codePlaceholder}
                />

                {feedback && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${feedback.passed ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                    <div className="font-semibold">{feedback.passed ? '✅ ' : '❌ '}{feedback.message}</div>
                    {feedback.score !== undefined && <div className="mt-1">Score: {feedback.score}/100</div>}
                    {feedback.feedback && <div className="mt-1 text-xs">{feedback.feedback}</div>}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={submitting || !code.trim()} className="btn-primary mt-3 w-full">
                  {submitting ? 'Submitting...' : `Submit Code (${mode} mode)`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
