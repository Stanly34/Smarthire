import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import RegisterCompany from './pages/RegisterCompany';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import JobList from './pages/student/JobList';
import MyApplications from './pages/student/MyApplications';
import CodingPractice from './pages/student/CodingPractice';
import Chat from './pages/Chat';

// Company pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import PostJob from './pages/company/PostJob';
import ViewApplicants from './pages/company/ViewApplicants';
import EligibleStudents from './pages/company/EligibleStudents';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageCompanies from './pages/admin/ManageCompanies';
import ManageJobs from './pages/admin/ManageJobs';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} /> : <Login />} />
      <Route path="/register/student" element={<RegisterStudent />} />
      <Route path="/register/company" element={<RegisterCompany />} />

      {/* Student routes */}
      <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute roles={['student']}><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/jobs" element={<ProtectedRoute roles={['student']}><JobList /></ProtectedRoute>} />
      <Route path="/student/applications" element={<ProtectedRoute roles={['student']}><MyApplications /></ProtectedRoute>} />
      <Route path="/student/coding" element={<ProtectedRoute roles={['student']}><CodingPractice /></ProtectedRoute>} />
      <Route path="/student/chat" element={<ProtectedRoute roles={['student']}><Chat /></ProtectedRoute>} />

      {/* Company routes */}
      <Route path="/company" element={<ProtectedRoute roles={['company']}><CompanyDashboard /></ProtectedRoute>} />
      <Route path="/company/profile" element={<ProtectedRoute roles={['company']}><CompanyProfile /></ProtectedRoute>} />
      <Route path="/company/post-job" element={<ProtectedRoute roles={['company']}><PostJob /></ProtectedRoute>} />
      <Route path="/company/applicants/:jobId" element={<ProtectedRoute roles={['company']}><ViewApplicants /></ProtectedRoute>} />
      <Route path="/company/eligible/:jobId" element={<ProtectedRoute roles={['company']}><EligibleStudents /></ProtectedRoute>} />
      <Route path="/company/chat" element={<ProtectedRoute roles={['company']}><Chat /></ProtectedRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/students" element={<ProtectedRoute roles={['admin']}><ManageStudents /></ProtectedRoute>} />
      <Route path="/admin/companies" element={<ProtectedRoute roles={['admin']}><ManageCompanies /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute roles={['admin']}><ManageJobs /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
