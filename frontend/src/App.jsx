import { Button, Container } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import { Home, UserPage, PostPage, AuthPage } from './pages';
import { Header } from './components';

function App() {
  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/:username' element={<UserPage />} />
        <Route path='/:username/post/:pid' element={<PostPage />} />
      </Routes>
    </Container>
  );
}

export default App;
