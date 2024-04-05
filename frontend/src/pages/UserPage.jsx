import { useParams } from 'react-router-dom';
import { UserHeader, UserPost } from '../components';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { Flex, Spinner } from '@chakra-ui/react';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast('An error has occured', data.error, 'error');
          return;
        }
        setUser(data);
      } catch (error) {
        showToast('An error has occured', error, 'error');
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent='center'>
        <Spinner size='xl' />
      </Flex>
    );
  }
  if (!user && !loading) return <h1> User not found</h1>;

  return (
    <>
      <UserHeader user={user} />
      <UserPost
        likes={1200}
        replies={479}
        postImg='/post1.png'
        postTitle='Lets talk about threads'
      />
      <UserPost
        likes={641}
        replies={252}
        postImg='/post2.png'
        postTitle='Great tutorial'
      />
      <UserPost
        likes={761}
        replies={331}
        postImg='/post3.png'
        postTitle='I love this guy'
      />
      <UserPost likes={214} replies={91} postTitle='This is my first thread' />
    </>
  );
};
export default UserPage;
