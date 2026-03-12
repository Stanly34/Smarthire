import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import api from '../../services/api';
import SkillTag from '../../components/SkillTag';

const POPULAR_SKILLS = ['Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'Machine Learning', 'Data Science', 'Django', 'Flask', 'Docker', 'AWS', 'Git', 'TypeScript'];

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [loadError, setLoadError] = useState('');
  const [allSkills, setAllSkills] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, s] = await Promise.all([api.get('/students/me'), api.get('/skills')]);
        setProfile(p.data);
        setForm({
          full_name: p.data.full_name || '',
          phone: p.data.phone || '',
          department: p.data.department || '',
          year_of_study: p.data.year_of_study || '',
          cgpa: p.data.cgpa || '',
          bio: p.data.bio || '',
          linkedin_url: p.data.linkedin_url || '',
          github_url: p.data.github_url || '',
          resume_url: p.data.resume_url || '',
        });
        setSkills(p.data.skills?.map(sk => sk.name) || []);
        setAllSkills(s.data.map(sk => sk.name));
      } catch (err) {
        setLoadError(err.response?.data?.message || 'Failed to load profile. Please refresh.');
      }
    };
    load();
  }, []);

  const addSkill = (name) => {
    if (name && !skills.includes(name)) setSkills([...skills, name]);
    setSkillInput('');
  };

  const removeSkill = (name) => setSkills(skills.filter(s => s !== name));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      await api.put('/students/me', { ...form, skills });
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <Layout><div className="card text-center py-12 text-red-600">{loadError}</div></Layout>;
  if (!profile) return <Layout><div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div></Layout>;

  return (
    <Layout title="My Profile">
      <form onSubmit={handleSave}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left – Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Full Name *</label>
                  <input className="input" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div>
                  <label className="label">Department</label>
                  <select className="input" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                    <option value="">Select</option>
                    {['Computer Science','Information Technology','Electronics','Mechanical','Civil','Chemical','Data Science','AI & ML'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Year of Study</label>
                  <select className="input" value={form.year_of_study} onChange={e => setForm({...form, year_of_study: e.target.value})}>
                    <option value="">Select</option>
                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">CGPA</label>
                  <input type="number" step="0.01" min="0" max="10" className="input" value={form.cgpa} onChange={e => setForm({...form, cgpa: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="label">Bio / About Me</label>
                  <textarea className="input" rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} placeholder="Tell companies about yourself..." />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold mb-4">Links</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">LinkedIn URL</label>
                  <input className="input" value={form.linkedin_url} onChange={e => setForm({...form, linkedin_url: e.target.value})} placeholder="https://linkedin.com/in/yourname" />
                </div>
                <div>
                  <label className="label">GitHub URL</label>
                  <input className="input" value={form.github_url} onChange={e => setForm({...form, github_url: e.target.value})} placeholder="https://github.com/yourname" />
                </div>
                <div>
                  <label className="label">Resume URL</label>
                  <input className="input" value={form.resume_url} onChange={e => setForm({...form, resume_url: e.target.value})} placeholder="https://drive.google.com/..." />
                </div>
              </div>
            </div>
          </div>

          {/* Right – Skills */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-bold mb-4">Technical Skills</h3>
              <div className="flex gap-2 mb-3">
                <input
                  className="input flex-1"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                  placeholder="Add a skill..."
                  list="skill-list"
                />
                <datalist id="skill-list">
                  {allSkills.map(s => <option key={s} value={s} />)}
                </datalist>
                <button type="button" onClick={() => addSkill(skillInput)} className="btn-primary px-3">+</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map(s => <SkillTag key={s} name={s} removable onRemove={removeSkill} />)}
                {skills.length === 0 && <p className="text-gray-400 text-sm">No skills added yet</p>}
              </div>
              <div className="border-t pt-3">
                <p className="text-xs text-gray-500 mb-2">Popular skills:</p>
                <div className="flex flex-wrap gap-1">
                  {POPULAR_SKILLS.filter(s => !skills.includes(s)).slice(0,8).map(s => (
                    <button key={s} type="button" onClick={() => addSkill(s)} className="text-xs border border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 px-2 py-0.5 rounded-full transition-colors">
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg font-bold mb-2">Coding Score</h3>
              <div className="text-center py-4">
                <div className="text-5xl font-extrabold text-blue-600">{profile.coding_score}</div>
                <div className="text-gray-500 text-sm mt-1">out of 100</div>
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${profile.coding_score}%` }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Take scored coding tests to improve your score</p>
            </div>
          </div>
        </div>

        {msg && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${msg.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {msg}
          </div>
        )}
        <div className="mt-6">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </Layout>
  );
}
