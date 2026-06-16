import { createContext, useReducer, useEffect, useContext } from 'react';
import { authReducer } from './authReducer';

const API_URL = 'http://localhost:3333';

export const AuthContext = createContext({});

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restaura sessão ao carregar o app
  useEffect(() => {
    const token = localStorage.getItem('chronos_token');
    const user = localStorage.getItem('chronos_user');

    if (token && user) {
      // Valida o token no backend
      fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Token inválido');
        })
        .then(({ user: validUser }) => {
          dispatch({ type: 'RESTORE_SESSION', payload: { user: validUser, token } });
        })
        .catch(() => {
          localStorage.removeItem('chronos_token');
          localStorage.removeItem('chronos_user');
          dispatch({ type: 'FINISH_LOADING' });
        });
    } else {
      dispatch({ type: 'FINISH_LOADING' });
    }
  }, []);

  // Funções de autenticação
  async function login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Erro ao fazer login.');

    localStorage.setItem('chronos_token', data.token);
    localStorage.setItem('chronos_user', JSON.stringify(data.user));
    dispatch({ type: 'LOGIN', payload: { user: data.user, token: data.token } });

    return data;
  }

  async function register(name, email, password) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Erro ao cadastrar.');

    localStorage.setItem('chronos_token', data.token);
    localStorage.setItem('chronos_user', JSON.stringify(data.user));
    dispatch({ type: 'LOGIN', payload: { user: data.user, token: data.token } });

    return data;
  }

  async function forgotPassword(email) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao solicitar recuperação.');
    return data;
  }

  async function resetPassword(token, newPassword) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro ao redefinir senha.');
    return data;
  }

  function logout() {
    localStorage.removeItem('chronos_token');
    localStorage.removeItem('chronos_user');
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider
      value={{
        authState: state,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
