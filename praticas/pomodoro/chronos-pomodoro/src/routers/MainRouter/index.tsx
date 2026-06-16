import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { History } from '../../pages/History';
import { Settings } from '../../pages/Settings';
import { Login } from '../../pages/Login';
import { Register } from '../../pages/Register';
import { ForgotPassword } from '../../pages/ForgotPassword';
import { ResetPassword } from '../../pages/ResetPassword';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function PrivateRoute({ element }: { element: JSX.Element }) {
  const { authState } = useAuth();

  if (authState.isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span>Carregando...</span>
      </div>
    );
  }

  return authState.isAuthenticated ? element : <Navigate to="/login" replace />;
}

function PublicOnlyRoute({ element }: { element: JSX.Element }) {
  const { authState } = useAuth();

  if (authState.isLoading) return null;

  return authState.isAuthenticated ? <Navigate to="/" replace /> : element;
}

export function MainRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<PublicOnlyRoute element={<Login />} />} />
        <Route path="/register" element={<PublicOnlyRoute element={<Register />} />} />
        <Route path="/forgot-password" element={<PublicOnlyRoute element={<ForgotPassword />} />} />
        <Route path="/reset-password" element={<PublicOnlyRoute element={<ResetPassword />} />} />

        {/* Rotas privadas */}
        <Route path="/" element={<PrivateRoute element={<Home />} />} />
        <Route path="/history/" element={<PrivateRoute element={<History />} />} />
        <Route path="/settings/" element={<PrivateRoute element={<Settings />} />} />
        <Route path="/about-pomodoro/" element={<PrivateRoute element={<AboutPomodoro />} />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
