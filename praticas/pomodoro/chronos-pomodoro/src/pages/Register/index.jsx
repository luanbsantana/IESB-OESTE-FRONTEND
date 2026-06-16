import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Register.module.css';

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();

    if (!name || !email || !password || !passwordConfirm) {
      setMessage({ text: 'Preencha todos os campos.', type: 'error' });
      return;
    }

    if (password.length < 6) {
      setMessage({ text: 'A senha deve ter pelo menos 6 caracteres.', type: 'error' });
      return;
    }

    if (password !== passwordConfirm) {
      setMessage({ text: 'As senhas não coincidem.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
  setMessage({
    text: err?.message || 'Erro ao cadastrar.',
    type: 'error'
  });
} finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.container}>
      <form className={styles.card} onSubmit={handleRegister}>
        <h1>Chronos</h1>
        <p className={styles.subtitle}>Crie sua conta</p>

        <div className={styles.inputGroup}>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
            required
            autoFocus
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="passwordConfirm">Confirmar senha</label>
          <input
            id="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Repita a senha"
            required
          />
        </div>

        {message.text && (
          <span className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </span>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
        </button>

        <div className={styles.links}>
          <Link to="/login" className={styles.link}>
            Já tem conta? Faça login
          </Link>
        </div>
      </form>
    </main>
  );
}
