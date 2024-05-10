import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import { Flex, Spinner, Text, Link } from '@chakra-ui/react';
import useGetUserProfile from '../hooks/useGetUserProfile';
import { UserCard } from '../components';

const FollowerPage = () => {
  const { user, loading } = useGetUserProfile();
  const { following } = useParams();
  const [usersList, setUsersList] = useState([]);

  useEffect(() => {
    if (!user) return;
    const getUsersList = () => {
      const users = following === 'followers' ? user.followers : user.following;
      setUsersList(users);
    };
    getUsersList();
  }, [user, following]);

  console.log('user:', user);
  console.log(following, usersList);

  if (loading) {
    return (
      <Flex justifyContent='center'>
        <Spinner size='xl' />
      </Flex>
    );
  }

  return (
    <>
      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={
            following === 'following' ? '1.5px solid white' : '1px solid gray'
          }
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
        >
          {following === 'following' ? (
            <Text
              fontWeight={'bold'}
              color={following === 'followers' ? 'gray.light' : 'white'}
            >
              Following
            </Text>
          ) : (
            <Link
              as={RouterLink}
              to={`/${user.username}/following`}
              fontWeight={'bold'}
              color={following === 'followers' ? 'gray.light' : 'white'}
            >
              Following
            </Link>
          )}
        </Flex>
        <Flex
          flex={1}
          borderBottom={
            following === 'following' ? '1.5px solid gray' : '1px solid white'
          }
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
        >
          {following === 'followers' ? (
            <Text
              fontWeight={'bold'}
              color={following === 'followers' ? 'white' : 'gray.light'}
            >
              Followers
            </Text>
          ) : (
            <Link
              as={RouterLink}
              to={`/${user.username}/followers`}
              fontWeight={'bold'}
              color={following === 'followers' ? 'white' : 'gray.light'}
            >
              Followers
            </Link>
          )}
        </Flex>
      </Flex>
      {usersList.map((id) => (
        <UserCard key={id} id={id} />
      ))}
    </>
  );
};

export default FollowerPage;