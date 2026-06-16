import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ResetPassword.module.css';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
 const { resetPassword } = useAuth();

  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <main className={styles.container}>
        <div className={styles.card}>
          <h1>Chronos</h1>
          <span className={`${styles.message} ${styles.error}`}>
            Link inválido. Solicite uma nova recuperação de senha.
          </span>
          <Link to="/forgot-password" className={styles.link}>
            Recuperar senha
          </Link>
        </div>
      </main>
    );
  }

 async function handleSubmit(event)  {
    event.preventDefault();

    if (!newPassword || !passwordConfirm) {
      setMessage({ text: 'Preencha todos os campos.', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: 'A senha deve ter pelo menos 6 caracteres.', type: 'error' });
      return;
    }

    if (newPassword !== passwordConfirm) {
      setMessage({ text: 'As senhas não coincidem.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await resetPassword(token, newPassword);
      setDone(true);
      setMessage({ text: 'Senha redefinida com sucesso!', type: 'success' });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setMessage({ text: err.message || 'Erro ao redefinir senha.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1>Chronos</h1>
        <p className={styles.subtitle}>Redefinir senha</p>

        {!done ? (
          <>
            <div className={styles.inputGroup}>
              <label htmlFor="newPassword">Nova senha</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                autoFocus
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="passwordConfirm">Confirmar nova senha</label>
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
              {isSubmitting ? 'Redefinindo...' : 'Redefinir senha'}
            </button>
          </>
        ) : (
          <span className={`${styles.message} ${styles.success}`}>
            {message.text} Redirecionando para o login…
          </span>
        )}

        <div className={styles.links}>
          <Link to="/login" className={styles.link}>
            Voltar ao login
          </Link>
        </div>
      </form>
    </main>
  );
}
