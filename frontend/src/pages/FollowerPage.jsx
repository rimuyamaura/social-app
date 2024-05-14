import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Flex, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import { UserCard } from '../components';
import useGetUserProfile from '../hooks/useGetUserProfile';

const FollowerPage = () => {
  const { user, loading } = useGetUserProfile();
  const { following } = useParams();
  const [usersList, setUsersList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const getUsersList = () => {
      fetch(`/api/users/${user.username}/${following}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('data:', data);
          data.sort((a, b) => new Date(b.followDate) - new Date(a.followDate));
          setUsersList(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
    getUsersList();
  }, [user, following]);

  // console.log('user:', user);
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
      <Flex direction={'column'} gap={2} my={10}>
        <Text fontWeight={'700'} alignItems={'center'} fontSize={'2xl'}>
          {user.name}
        </Text>
        <Text fontSize={'xs'} color={useColorModeValue('gray.500', 'gray.400')}>
          @{user.username}
        </Text>
      </Flex>

      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1.5px solid'}
          borderColor={
            following === 'following'
              ? useColorModeValue('gray.light', 'white')
              : useColorModeValue('gray.300', 'gray.light')
          }
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
        >
          {following === 'following' ? (
            <Text
              fontWeight={'bold'}
              color={useColorModeValue('gray.light', 'white')}
            >
              Following
            </Text>
          ) : (
            <Text
              fontWeight={'bold'}
              color={useColorModeValue('gray.400', 'gray.light')}
              onClick={() => navigate(`/${user.username}/following`)}
            >
              Following
            </Text>
          )}
        </Flex>

        <Flex
          flex={1}
          borderBottom={'1.5px solid'}
          borderColor={
            following === 'following'
              ? useColorModeValue('gray.300', 'gray.light')
              : useColorModeValue('gray.light', 'white')
          }
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
        >
          {following === 'followers' ? (
            <Text
              fontWeight={'bold'}
              color={useColorModeValue('gray.light', 'white')}
            >
              Followers
            </Text>
          ) : (
            <Text
              fontWeight={'bold'}
              color={useColorModeValue('gray.400', 'gray.light')}
              onClick={() => navigate(`/${user.username}/followers`)}
            >
              Followers
            </Text>
          )}
        </Flex>
      </Flex>
      {usersList.map((user) => (
        <UserCard key={user._id} user={user.user} />
      ))}
      {!usersList.length && (
        <Flex justifyContent='center'>
          <Text
            m={10}
            fontWeight={'500'}
            display={'flex'}
            alignItems={'center'}
          >
            No users found
          </Text>
        </Flex>
      )}
    </>
  );
};

export default FollowerPage;
