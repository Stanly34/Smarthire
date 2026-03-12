import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  { icon: '🤖', title: 'AI Job Matching', desc: 'Smart algorithm matches your skills to the best job opportunities automatically.' },
  { icon: '💻', title: 'Coding Practice', desc: 'Practice coding problems and earn scores that companies can view during recruitment.' },
  { icon: '💬', title: 'Real-Time Chat', desc: 'Communicate directly with companies through our built-in messaging system.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Detailed placement analytics for college administrators to track progress.' },
  { icon: '🔐', title: 'Secure Platform', desc: 'JWT authentication and admin-controlled approval system for maximum security.' },
  { icon: '🎯', title: 'Smart Filtering', desc: 'Companies filter eligible students by skills, CGPA, and coding scores.' },
];

const stats = [
  { label: 'Students Placed', value: '2,400+' },
  { label: 'Partner Companies', value: '150+' },
  { label: 'Jobs Posted', value: '800+' },
  { label: 'Placement Rate', value: '87%' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-blue-600">SmartHire</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">AI Powered</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm">Login</Link>
            <Link to="/register/student" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-block bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-full mb-6 backdrop-blur">
            🎓 Intelligent College Placement Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Land Your Dream Job<br />
            <span className="text-blue-300">Powered by AI</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            SmartHire connects students with top companies through intelligent skill matching,
            coding assessments, and streamlined recruitment — all managed by your college.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register/student" className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors text-lg">
              I'm a Student →
            </Link>
            <Link to="/register/company" className="border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg">
              I'm a Company →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-extrabold text-blue-400">{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">A complete ecosystem for modern campus recruitment and student skill development.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-14">How SmartHire Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register & Get Approved', desc: 'Create your profile as a student or company. Admin approves your account for security.' },
              { step: '02', title: 'Add Skills & Practice', desc: 'Students add skills and practice coding. Companies post jobs with required skills.' },
              { step: '03', title: 'AI Matches & Connect', desc: 'Our algorithm matches students to jobs. Apply, chat, get hired!' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white text-xl font-bold rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-blue-100 mb-8">Join thousands of students who found their dream careers through SmartHire.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/register/student" className="bg-white text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors">
            Register as Student
          </Link>
          <Link to="/login" className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors">
            Login
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <div className="text-blue-400 font-bold text-lg mb-1">SmartHire</div>
        <div className="text-sm">AI Based College Placement Platform © 2025</div>
        <div className="text-xs mt-2 space-x-4">
          <span>Admin Login: admin@smarthire.com</span>
          <span>|</span>
          <span>Password: password</span>
        </div>
      </footer>
    </div>
  );
}
