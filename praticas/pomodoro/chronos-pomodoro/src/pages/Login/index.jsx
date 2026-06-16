import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    if (!email || !password) {
      setMessage({ text: 'Preencha e-mail e senha.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setMessage({ text: err.message || 'Erro ao fazer login.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
        <h1>Chronos</h1>
        <p className={styles.subtitle}>Faça login para continuar</p>

        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            autoFocus
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
        </div>

        {message.text && (
          <span className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </span>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>

        <div className={styles.links}>
          <Link to="/forgot-password" className={styles.link}>
            Esqueci minha senha
          </Link>
          <Link to="/register" className={styles.link}>
            Não tem conta? Cadastre-se
          </Link>
        </div>
      </form>
    </main>
  );
}
