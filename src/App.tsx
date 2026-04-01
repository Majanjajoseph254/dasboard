import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';

function AppRoutes() {
  const { session, login, signup, logout } = useAuth();

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={login} />} />
        <Route path="/signup" element={<SignupPage onSignup={signup} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout session={session} onLogout={logout}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage session={session} />} />
        <Route path="/profile" element={<ProfilePage session={session} />} />
        <Route path="/projects" element={<ProjectsPage session={session} />} />
        <Route path="/projects/:id" element={<ProjectDetailPage session={session} />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
