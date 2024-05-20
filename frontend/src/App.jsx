import { Container, Box } from '@chakra-ui/react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  HomePage,
  UserPage,
  UpdateProfilePage,
  FollowerPage,
  PostPage,
  AuthPage,
  ChatPage,
} from './pages';
import { Header, CreatePost } from './components';
import { useRecoilValue } from 'recoil';
import userAtom from './atoms/userAtom';

function App() {
  const user = useRecoilValue(userAtom);

  const { pathname } = useLocation();

  return (
    <Box position={'relative'} w={'full'} pt={'75px'}>
      <Container
        maxW={pathname === '/' ? { base: '620px', md: '900px' } : '620px'}
      >
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

          <Route
            path='/:username'
            element={
              user ? (
                <>
                  <UserPage />
                  <CreatePost />
                </>
              ) : (
                <UserPage />
              )
            }
          />
          <Route path='/:username/post/:pid' element={<PostPage />} />
          <Route path='/:username/:following' element={<FollowerPage />} />
          <Route
            path='/chat'
            element={user ? <ChatPage /> : <Navigate to={'/auth'} />}
          />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
