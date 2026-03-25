
import { Heading } from './components/heading/Heading';
import { Container } from './components/container/Container';
import './styles/global.css';
import { Logo } from './components/logo/Logo';

import './styles/theme.css';




export function App() {
  return (
    <>
      <Container>
        <Logo />
      </Container>

      <Container>
        <Heading>MENU</Heading>
      </Container>
    </>
  );
}