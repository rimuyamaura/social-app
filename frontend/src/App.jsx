import { Container } from '@chakra-ui/react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
  HomePage,
  UserPage,
  PostPage,
  AuthPage,
  UpdateProfilePage,
} from './pages';
import { Header, LogoutButton } from './components';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';

function App() {
  const user = useRecoilValue(userAtom);
  console.log(user);
  return (
    <Container maxW='620px'>
      <Header />
      <Routes>
        <Route
          path='/'
          element={user ? <HomePage /> : <Navigate to='/auth' />}
        />
        <Route
          path='/auth'
          element={!user ? <AuthPage /> : <Navigate to='/' />}
        />
        <Route
          path='/update'
          element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />}
        />

        <Route path='/:username' element={<UserPage />} />
        <Route path='/:username/post/:pid' element={<PostPage />} />
      </Routes>

      {user && <LogoutButton />}
    </Container>
  );
}

export default App;
