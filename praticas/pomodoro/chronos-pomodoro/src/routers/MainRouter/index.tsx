import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router';
import { AboutPomodoro } from '../../pages/AboutPomodoro';
import { NotFound } from '../../pages/NotFound';
import { Home } from '../../pages/Home';
import { History } from '../../pages/History';
import { Settings } from '../../pages/Settings';
import { Login } from '../../pages/Login';

import { useEffect, useState } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

export function MainRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* LOGIN */}
        <Route
          path='/login'
          element={
            <Login setIsAuthenticated={setIsAuthenticated} />
          }
        />

        {/* HOME */}
        <Route
          path='/'
          element={
            isAuthenticated ? (
              <Home />
            ) : (
              <Navigate to='/login' />
            )
          }
        />

        {/* HISTORY */}
        <Route
          path='/history/'
          element={
            isAuthenticated ? (
              <History />
            ) : (
              <Navigate to='/login' />
            )
          }
        />

        {/* SETTINGS */}
        <Route
          path='/settings/'
          element={
            isAuthenticated ? (
              <Settings />
            ) : (
              <Navigate to='/login' />
            )
          }
        />

        {/* ABOUT */}
        <Route
          path='/about-pomodoro/'
          element={
            isAuthenticated ? (
              <AboutPomodoro />
            ) : (
              <Navigate to='/login' />
            )
          }
        />

        {/* NOT FOUND */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}