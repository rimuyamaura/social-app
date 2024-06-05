import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Flex,
  Spinner,
  Text,
  Box,
  SkeletonCircle,
  Skeleton,
  useColorModeValue,
} from '@chakra-ui/react';
import { UserCard } from '../components';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';

const FollowerPage = () => {
  const { user, loading } = useGetUserProfile();
  const [usersList, setUsersList] = useState([]);
  const [loadingUsersList, setLoadingUsersList] = useState(true);
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { following } = useParams();

  const gray400GrayLight = useColorModeValue('gray.400', 'gray.light');
  const grayLightWhite = useColorModeValue('gray.light', 'white');
  const gray300GrayLight = useColorModeValue('gray.300', 'gray.light');
  const gray500Gray400 = useColorModeValue('gray.500', 'gray.400');

  useEffect(() => {
    const getUsersList = async () => {
      if (!user) return;
      try {
        setLoadingUsersList(true);
        const res = await fetch(`/api/users/${user.username}/${following}`);
        const data = await res.json();
        data.sort((a, b) => new Date(b.followDate) - new Date(a.followDate));
        setUsersList(data);
      } catch (error) {
        showToast('An error has occured', error.message, 'error');
      } finally {
        setLoadingUsersList(false);
      }
    };
    getUsersList();
  }, [user, following, showToast]);

  if (loading) {
    return (
      <Flex justifyContent='center'>
        <Spinner size='xl' />
      </Flex>
    );
  }

  const NumberofSkeletons =
    following === 'followers' ? user?.followers : user?.following;

  return (
    <>
      {user && (
        <Flex direction={'column'} gap={2} my={10}>
          <Text fontWeight={'700'} alignItems={'center'} fontSize={'2xl'}>
            {user.name}
          </Text>
          <Text fontSize={'xs'} color={gray500Gray400}>
            @{user.username}
          </Text>
        </Flex>
      )}

      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1.5px solid'}
          borderColor={
            following === 'following' ? grayLightWhite : gray300GrayLight
          }
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
          onClick={() => navigate(`/${user.username}/following`)}
        >
          {following === 'following' ? (
            <Text fontWeight={'bold'} color={grayLightWhite}>
              Following
            </Text>
          ) : (
            <Text fontWeight={'bold'} color={gray400GrayLight}>
              Following
            </Text>
          )}
        </Flex>
        <Flex
          flex={1}
          borderBottom={'1.5px solid'}
          borderColor={
            following === 'following' ? gray300GrayLight : grayLightWhite
          }
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
          onClick={() => navigate(`/${user.username}/followers`)}
        >
          {following === 'followers' ? (
            <Text fontWeight={'bold'} color={grayLightWhite}>
              Followers
            </Text>
          ) : (
            <Text fontWeight={'bold'} color={gray400GrayLight}>
              Followers
            </Text>
          )}
        </Flex>
      </Flex>

      {loadingUsersList ? (
        NumberofSkeletons.map((_, i) => (
          <Flex
            key={i}
            gap={4}
            alignItems={'center'}
            p={'7'}
            borderRadius={'md'}
          >
            <Box>
              <SkeletonCircle size={'10'} />
            </Box>
            <Flex w={'full'} flexDirection={'column'} gap={3}>
              <Skeleton h={'10px'} w={'80px'} />
              <Skeleton h={'8px'} w={'100%'} />
            </Flex>
          </Flex>
        ))
      ) : usersList.length > 0 ? (
        usersList.map((userInfo, i) => (
          <UserCard key={i} user={userInfo.user} />
        ))
      ) : (
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
