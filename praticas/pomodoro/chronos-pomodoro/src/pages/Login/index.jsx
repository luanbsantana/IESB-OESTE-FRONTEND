import { useState } from 'react';
import { useNavigate } from 'react-router';

import styles from './Login.module.css';

export function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();

  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleLogin(event) {
    event.preventDefault();

    setMessage('Login enviado com sucesso!');

    setTimeout(() => {
      setIsAuthenticated(true);

      navigate('/');
    }, 1000);
  }

  return (
    <main className={styles.container}>
      <form className={styles.card} onSubmit={handleLogin}>
        <h1>Chronos</h1>

        <div className={styles.inputGroup}>
          <label htmlFor='user'>Usuário</label>

          <input
            id='user'
            type='text'
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder='Digite seu usuário'
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='password'>Senha</label>

          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Digite sua senha'
          />
        </div>

        <button type='submit'>
          Entrar
        </button>

        {message && (
          <span className={styles.message}>
            {message}
          </span>
        )}

        <button
          type='button'
          className={styles.link}
          onClick={() =>
            setMessage('Cadastro em desenvolvimento')
          }
        >
          Não tem conta? Cadastre-se
        </button>

        <button
          type='button'
          className={styles.link}
          onClick={() =>
            setMessage('Recuperação de senha em desenvolvimento')
          }
        >
          Esqueci minha senha
        </button>
      </form>
    </main>
  );
}