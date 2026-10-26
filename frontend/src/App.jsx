import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import ProjectDetailPage from './pages/ProjectDetailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import LeetCodeDashboardPage from './pages/LeetCodeDashboardPage.jsx';
import CodeforcesDashboardPage from './pages/CodeforcesDashboardPage.jsx';
import DsaProblemDetailPage from './pages/DsaProblemDetailPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:slug" element={<ProjectDetailPage />} />
      <Route path="/dsa" element={<Navigate to="/dsa/leetcode" replace />} />
      <Route path="/dsa/leetcode" element={<LeetCodeDashboardPage />} />
      <Route path="/dsa/codeforces" element={<CodeforcesDashboardPage />} />
      <Route path="/dsa/:platform/problems/:slug" element={<DsaProblemDetailPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
