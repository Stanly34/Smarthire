import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';

const LEVEL_ORDER = ['beginner', 'intermediate', 'advanced'];
const LEVEL_TITLES = {
  beginner: 'Beginner Languages',
  intermediate: 'Intermediate Languages',
  advanced: 'Advanced Languages',
};
const DIFFICULTY_COLOR = { beginner: 'badge-green', intermediate: 'badge-yellow', advanced: 'badge-red' };

export default function CodingPractice() {
  const [progress, setProgress] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [currentState, setCurrentState] = useState(null);
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('practice');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [tab, setTab] = useState('problems');
  const [loading, setLoading] = useState(true);
  const [loadingCurrent, setLoadingCurrent] = useState(false);

  const groupedProgress = useMemo(
    () =>
      LEVEL_ORDER.map(level => ({
        level,
        title: LEVEL_TITLES[level],
        items: progress.filter(item => item.language_level === level),
      })).filter(group => group.items.length > 0),
    [progress]
  );

  const selectedProgress = progress.find(item => item.language === selectedLanguage) || null;

  const refreshOverview = async (preferredLanguage) => {
    const [progressResponse, resultsResponse] = await Promise.all([
      api.get('/coding/progress/me'),
      api.get('/coding/results/me'),
    ]);

    setProgress(progressResponse.data);
    setResults(resultsResponse.data);

    const availableLanguage =
      (preferredLanguage && progressResponse.data.find(item => item.language === preferredLanguage)?.language) ||
      progressResponse.data.find(item => !item.is_completed)?.language ||
      progressResponse.data[0]?.language ||
      '';

    setSelectedLanguage(current => (current && progressResponse.data.some(item => item.language === current) ? current : availableLanguage));
    return progressResponse.data;
  };

  const loadCurrentProblem = async language => {
    if (!language) {
      setCurrentState(null);
      setCode('');
      return;
    }

    setLoadingCurrent(true);
    try {
      const response = await api.get('/coding/current', { params: { language } });
      setCurrentState(response.data);
      setCode(response.data.current_problem?.starter_code || '');
      setFeedback(null);
    } catch (error) {
      console.error('Failed to load current coding task:', error);
      setCurrentState(null);
      setCode('');
    } finally {
      setLoadingCurrent(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const progressRows = await refreshOverview();
        const firstLanguage =
          progressRows.find(item => !item.is_completed)?.language ||
          progressRows[0]?.language ||
          '';

        if (firstLanguage) {
          setSelectedLanguage(firstLanguage);
        }
      } catch (error) {
        console.error('Failed to load coding practice overview:', error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      loadCurrentProblem(selectedLanguage);
    }
  }, [selectedLanguage]);

  const handleSubmit = async () => {
    const currentProblem = currentState?.current_problem;
    if (!currentProblem || !code.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await api.post('/coding/submit', {
        problem_id: currentProblem.id,
        submitted_code: code,
        mode,
      });

      setFeedback(response.data);
      await refreshOverview(selectedLanguage);

      if (response.data.passed) {
        if (response.data.unlocked_next_task) {
          setCurrentState(prev => (prev ? {
            ...prev,
            completed_count: response.data.completed_count,
            current_task_number: response.data.current_task_number,
            is_completed: false,
            current_problem: response.data.unlocked_next_task,
          } : prev));
          setCode(response.data.unlocked_next_task.starter_code || '');
        } else {
          setCurrentState(prev => (prev ? {
            ...prev,
            completed_count: response.data.completed_count,
            current_task_number: response.data.current_task_number,
            is_completed: true,
            current_problem: null,
          } : prev));
          setCode('');
        }
      }
    } catch (error) {
      setFeedback({
        passed: false,
        message: error.response?.data?.message || 'Submission failed',
        feedback: error.response?.data?.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title="Coding Practice">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab('problems')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'problems' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Problems
        </button>
        <button
          onClick={() => setTab('results')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          My Results ({results.length})
        </button>
      </div>

      {tab === 'results' ? (
        <div className="card">
          <h3 className="text-lg font-bold mb-4">Submission History</h3>
          {results.length === 0 ? (
            <p className="text-gray-500">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 border-b">
                  <tr>
                    <th className="pb-2">Language</th>
                    <th className="pb-2">Task</th>
                    <th className="pb-2">Problem</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Mode</th>
                    <th className="pb-2">Score</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {results.map(result => (
                    <tr key={result.id}>
                      <td className="py-2">
                        <div className="font-medium">{result.language}</div>
                        <div className="text-xs text-gray-500 capitalize">{result.language_level || result.difficulty || 'legacy'}</div>
                      </td>
                      <td className="py-2">{result.task_number ? `Task ${result.task_number}` : 'Legacy'}</td>
                      <td className="py-2 font-medium">{result.title}</td>
                      <td className="py-2">
                        <span className={`badge ${
                          result.passed === true ? 'badge-green' : result.passed === false ? 'badge-red' : 'badge-gray'
                        }`}>
                          {result.passed === true ? 'Passed' : result.passed === false ? 'Failed' : 'Legacy'}
                        </span>
                      </td>
                      <td className="py-2 capitalize">{result.mode}</td>
                      <td className="py-2">{result.score}</td>
                      <td className="py-2 text-gray-500">{new Date(result.submitted_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="card mb-4">
              <h3 className="text-lg font-bold mb-2">Language Progress</h3>
              <p className="text-sm text-gray-500">
                Each language unlocks one coding task at a time. Pass the current task to see the next one.
              </p>
            </div>

            {loading ? (
              <div className="card text-sm text-gray-500">Loading coding practice...</div>
            ) : groupedProgress.length === 0 ? (
              <div className="card text-sm text-gray-500">No coding languages are available yet.</div>
            ) : (
              <div className="space-y-4">
                {groupedProgress.map(group => (
                  <div key={group.level}>
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{group.title}</div>
                    <div className="space-y-2">
                      {group.items.map(item => (
                        <button
                          key={item.language}
                          onClick={() => setSelectedLanguage(item.language)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${selectedLanguage === item.language ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="font-medium text-sm">{item.language}</div>
                              <div className="flex gap-2 mt-1">
                                <span className={`badge text-xs ${DIFFICULTY_COLOR[item.language_level]}`}>{item.language_level}</span>
                                <span className="badge badge-gray text-xs">
                                  {item.is_completed ? 'Completed' : `Task ${Math.min(item.current_task_number, item.total_tasks)} / ${item.total_tasks}`}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.is_completed ? '10 / 10' : `${item.completed_count} / ${item.total_tasks}`}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            {!selectedLanguage ? (
              <div className="card h-full flex items-center justify-center text-gray-400 text-center py-20">
                Select a language to start solving code tasks.
              </div>
            ) : loadingCurrent ? (
              <div className="card h-full flex items-center justify-center text-gray-400 text-center py-20">
                Loading the current task...
              </div>
            ) : currentState?.is_completed ? (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedLanguage}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`badge ${DIFFICULTY_COLOR[selectedProgress?.language_level || currentState.language_level]}`}>
                        {selectedProgress?.language_level || currentState.language_level}
                      </span>
                      <span className="badge badge-gray">Completed 10 / 10</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm">
                  You completed all coding tasks for {selectedLanguage}. Pick another language from the left to continue.
                </div>
              </div>
            ) : !currentState?.current_problem ? (
              <div className="card h-full flex items-center justify-center text-gray-400 text-center py-20">
                No unlocked task is available for this language right now.
              </div>
            ) : (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                      {selectedLanguage} · Task {currentState.current_problem.task_number} of {currentState.total_tasks}
                    </div>
                    <h3 className="text-lg font-bold">{currentState.current_problem.title}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className={`badge ${DIFFICULTY_COLOR[currentState.language_level]}`}>{currentState.language_level}</span>
                      <span className="badge badge-gray">{selectedLanguage}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <button
                      onClick={() => setMode('practice')}
                      className={`px-3 py-1 rounded-lg transition-colors ${mode === 'practice' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      Practice
                    </button>
                    <button
                      onClick={() => setMode('score')}
                      className={`px-3 py-1 rounded-lg transition-colors ${mode === 'score' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      Scored
                    </button>
                  </div>
                </div>

                {mode === 'score' && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-2 rounded mb-3">
                    Score mode: a passing solution updates your coding score and also unlocks the next task.
                  </div>
                )}

                <div className="bg-gray-50 border rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 whitespace-pre-line mb-2">{currentState.current_problem.description}</p>
                  <div className="text-xs text-gray-500 whitespace-pre-line">
                    <span className="font-semibold">Sample Input:</span>{'\n'}
                    {currentState.current_problem.sample_input}
                    {'\n'}
                    <span className="font-semibold">Sample Output:</span>{'\n'}
                    {currentState.current_problem.sample_output}
                  </div>
                </div>

                <textarea
                  className="w-full font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={18}
                  value={code}
                  onChange={event => setCode(event.target.value)}
                />

                {feedback && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${feedback.passed ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
                    <div className="font-semibold">{feedback.message}</div>
                    {feedback.score !== undefined && <div className="mt-1">Score: {feedback.score}/100</div>}
                    {feedback.feedback && <div className="mt-1 text-xs">{feedback.feedback}</div>}
                  </div>
                )}

                <button onClick={handleSubmit} disabled={submitting || !code.trim()} className="btn-primary mt-3 w-full">
                  {submitting ? 'Running tests...' : `Submit Code (${mode} mode)`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
