import { useEffect } from 'react';
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { MainTemplate } from '../../templates/MainTemplate';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Home.module.css';

export function Home() {
  const { authState } = useAuth();
  const userName = authState.user?.name || authState.user?.email || 'usuário';

  useEffect(() => {
    document.title = 'Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      <div className={styles.welcome}>
        Olá, <strong>{userName}</strong>! Pronto para focar? 🍅
      </div>

      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
