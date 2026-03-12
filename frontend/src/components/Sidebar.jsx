import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
  { to: '/student', label: 'Dashboard', icon: '🏠' },
  { to: '/student/profile', label: 'My Profile', icon: '👤' },
  { to: '/student/jobs', label: 'Browse Jobs', icon: '💼' },
  { to: '/student/applications', label: 'Applications', icon: '📋' },
  { to: '/student/coding', label: 'Coding Practice', icon: '💻' },
  { to: '/student/chat', label: 'Messages', icon: '💬' },
];

const companyLinks = [
  { to: '/company', label: 'Dashboard', icon: '🏠' },
  { to: '/company/profile', label: 'Company Profile', icon: '🏢' },
  { to: '/company/post-job', label: 'Post a Job', icon: '➕' },
  { to: '/company/chat', label: 'Messages', icon: '💬' },
];

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '🏠' },
  { to: '/admin/students', label: 'Students', icon: '🎓' },
  { to: '/admin/companies', label: 'Companies', icon: '🏢' },
  { to: '/admin/jobs', label: 'Jobs', icon: '💼' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const links = user?.role === 'student' ? studentLinks : user?.role === 'company' ? companyLinks : adminLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white min-h-screen flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <div>
            <span className="text-xl font-bold text-blue-400">SmartHire</span>
            <div className="text-xs text-gray-400 capitalize">{user?.role} Portal</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-gray-400 hover:text-white p-1 rounded">
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-4">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-colors ${
                active ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="border-t border-gray-700 p-4">
        {!collapsed && (
          <div className="mb-3">
            <div className="text-xs text-gray-400">Logged in as</div>
            <div className="text-sm font-medium truncate">{user?.email}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors w-full"
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
