import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import ProfilePage from './pages/ProfilePage';
import PetDetailPage from './pages/PetDetailPage';
import PublishPage from './pages/PublishPage';
import AgreementPage from './pages/AgreementPage';
import PublishSuccessPage from './pages/PublishSuccessPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import ChatPage from './pages/ChatPage';
import MessagesPage from './pages/MessagesPage';
import FeedbackPage from './pages/FeedbackPage';
import EditProfilePage from './pages/EditProfilePage';
import SettingsPage from './pages/SettingsPage';
import MyFavoritesPage from './pages/MyFavoritesPage';
import MyPostsPage from './pages/MyPostsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPosts from './pages/admin/AdminPosts';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminContent from './pages/admin/AdminContent';

const ENABLE_ADMIN = import.meta.env.VITE_ENABLE_ADMIN === 'true';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes without BottomNav */}
      <Route path="/publish" element={
        <ProtectedRoute>
          <PublishPage />
        </ProtectedRoute>
      } />
      <Route path="/agreement" element={
        <ProtectedRoute>
          <AgreementPage />
        </ProtectedRoute>
      } />
      <Route path="/publish/success" element={
        <ProtectedRoute>
          <PublishSuccessPage />
        </ProtectedRoute>
      } />
      <Route path="/chat/:id" element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />
      <Route path="/chat" element={ // Fallback or direct access
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />
      <Route path="/feedback" element={
        <ProtectedRoute>
          <FeedbackPage />
        </ProtectedRoute>
      } />
      <Route path="/profile/edit" element={
        <ProtectedRoute>
          <EditProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/profile/favorites" element={
        <ProtectedRoute>
          <MyFavoritesPage />
        </ProtectedRoute>
      } />
      <Route path="/profile/posts" element={
        <ProtectedRoute>
          <MyPostsPage />
        </ProtectedRoute>
      } />
      <Route path="/profile/applications" element={
        <ProtectedRoute>
          <MyApplicationsPage />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      } />

      {/* Detail Page (Public but no BottomNav) */}
      <Route path="/detail/:id" element={<PetDetailPage />} />

      {/* Main Layout with BottomNav */}
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/messages" element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* Admin Layout (Protected by VITE_ENABLE_ADMIN during build) */}
      {ENABLE_ADMIN && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="content" element={<AdminContent />} />
        </Route>
      )}
    </Routes>
  );
}
