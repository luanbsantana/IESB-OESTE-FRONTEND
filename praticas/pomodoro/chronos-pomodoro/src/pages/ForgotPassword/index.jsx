import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ForgotPassword.module.css';

export function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  // Em laboratório, exibe o token retornado pela API para o professor testar
  const [debugToken, setDebugToken] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email) {
      setMessage({ text: 'Informe seu e-mail.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const data = await forgotPassword(email);
      setSent(true);
      setMessage({
        text: 'Se o e-mail estiver cadastrado, você receberá as instruções.',
        type: 'success',
      });
      // Exibe o link de laboratório
      if (data.resetLink) setDebugToken(data.resetLink);
    } catch (err) {
  setMessage({
    text: err?.message || 'Erro ao solicitar recuperação.',
    type: 'error'
  });
} finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1>Chronos</h1>
        <p className={styles.subtitle}>Recuperar senha</p>

        {!sent ? (
          <>
            <p className={styles.info}>
              Informe o e-mail da sua conta e enviaremos as instruções para redefinir sua senha.
            </p>

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

            {message.text && (
              <span className={`${styles.message} ${styles[message.type]}`}>
                {message.text}
              </span>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar instruções'}
            </button>
          </>
        ) : (
          <>
            <span className={`${styles.message} ${styles.success}`}>
              {message.text}
            </span>

            {debugToken && (
              <div className={styles.debugBox}>
                <p className={styles.debugTitle}>⚠️ Ambiente de Laboratório</p>
                <p className={styles.debugText}>
                  Em produção este link seria enviado por e-mail. Para testar, use:
                </p>
                <a
                  href={debugToken}
                  className={styles.debugLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {debugToken}
                </a>
              </div>
            )}
          </>
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
