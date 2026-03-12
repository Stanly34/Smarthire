import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import api from '../../services/api';
import SkillTag from '../../components/SkillTag';

const ALL_SKILLS = ['Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Science', 'Django', 'Flask', 'Docker', 'AWS', 'Git', 'TypeScript', 'Spring Boot', 'Angular', 'Vue.js', 'PostgreSQL', 'MongoDB'];

export default function PostJob() {
  const [form, setForm] = useState({
    title: '', description: '', location: '', salary_range: '', job_type: 'full-time',
    min_cgpa: '0', min_coding_score: '0', interview_date: '', deadline: '',
  });
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const addSkill = (name) => {
    if (name && !skills.includes(name)) setSkills([...skills, name]);
    setSkillInput('');
  };

  const removeSkill = (name) => setSkills(skills.filter(s => s !== name));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return setMsg('Job title is required');
    setSaving(true);
    setMsg('');
    try {
      await api.post('/jobs', { ...form, skills });
      setMsg('Job posted successfully!');
      setTimeout(() => navigate('/company'), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout title="Post a Job">
      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Job Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Job Title *</label>
                <input className="input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required placeholder="e.g. Full Stack Developer" />
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Bangalore, India" />
              </div>
              <div>
                <label className="label">Job Type</label>
                <select className="input" value={form.job_type} onChange={e => setForm({...form, job_type: e.target.value})}>
                  {['full-time','part-time','internship','contract'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Salary Range</label>
                <input className="input" value={form.salary_range} onChange={e => setForm({...form, salary_range: e.target.value})} placeholder="₹6 LPA – ₹12 LPA" />
              </div>
              <div>
                <label className="label">Application Deadline</label>
                <input type="date" className="input" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
              </div>
              <div>
                <label className="label">Interview Date</label>
                <input type="date" className="input" value={form.interview_date} onChange={e => setForm({...form, interview_date: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="label">Job Description</label>
                <textarea className="input" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the role, responsibilities and what you're looking for..." />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-4">Eligibility Requirements</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Minimum CGPA</label>
                <input type="number" step="0.1" min="0" max="10" className="input" value={form.min_cgpa} onChange={e => setForm({...form, min_cgpa: e.target.value})} />
              </div>
              <div>
                <label className="label">Minimum Coding Score</label>
                <input type="number" min="0" max="100" className="input" value={form.min_coding_score} onChange={e => setForm({...form, min_coding_score: e.target.value})} />
              </div>
            </div>

            <label className="label">Required Skills</label>
            <div className="flex gap-2 mb-3">
              <input
                className="input flex-1"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                placeholder="Add required skill..."
                list="skill-list"
              />
              <datalist id="skill-list">
                {ALL_SKILLS.map(s => <option key={s} value={s} />)}
              </datalist>
              <button type="button" onClick={() => addSkill(skillInput)} className="btn-primary px-3">+</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map(s => <SkillTag key={s} name={s} removable onRemove={removeSkill} />)}
              {skills.length === 0 && <p className="text-gray-400 text-sm">No skills added yet</p>}
            </div>
            <div className="flex flex-wrap gap-1">
              {ALL_SKILLS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                <button key={s} type="button" onClick={() => addSkill(s)} className="text-xs border border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 px-2 py-0.5 rounded-full transition-colors">
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {msg && (
            <div className={`p-3 rounded-lg text-sm ${msg.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{msg}</div>
          )}
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Posting...' : 'Post Job'}</button>
        </form>
      </div>
    </Layout>
  );
}
