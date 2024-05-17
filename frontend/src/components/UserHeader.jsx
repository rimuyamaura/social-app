import {
  VStack,
  Box,
  Avatar,
  Flex,
  Text,
  Link,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useToast,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { BsInstagram } from 'react-icons/bs';
import { CgMoreO } from 'react-icons/cg';
import { useRecoilValue } from 'recoil';
import { Link as RouterLink } from 'react-router-dom';
import userAtom from '../atoms/userAtom';
import useFollowUnfollow from '../hooks/useFollowUnfollow';

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtom);

  const gray300GrayLight = useColorModeValue('gray.300', 'gray.light');
  const gray400GrayLight = useColorModeValue('gray.400', 'gray.light');
  const grayLightWhite = useColorModeValue('gray.light', 'white');

  // console.log(user);

  const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: 'Link copied to clipboard',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
  };

  return (
    <VStack gap={4} alignItems={'start'}>
      <Flex justifyContent={'space-between'} w={'full'}>
        <Box>
          <Text fontSize={'2xl'} fontWeight={'bold'} mb={2}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={'center'}>
            <Text
              fontSize={'sm'}
              bg={useColorModeValue('gray.300', 'gray.dark')}
              color={useColorModeValue('gray.dark', 'gray.400')}
              p={0.5}
              px={2}
              borderRadius={'full'}
            >
              @{user.username}
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.username}
              src={user.profilePic}
              size={{ base: 'lg', md: 'xl' }}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.username}
              src='https://bit.ly/broken-link'
              size={{ base: 'lg', md: 'xl' }}
            />
          )}
        </Box>
      </Flex>

      <Text fontSize={'sm'}>{user.bio}</Text>
      <Flex gap={4} alignItems={'center'}>
        <Link
          as={RouterLink}
          to={`/${user.username}/following`}
          color={'gray.light'}
          fontSize={'sm'}
        >
          <span style={{ fontWeight: '500' }}>{user.following.length} </span>
          following
        </Link>
        <Link
          as={RouterLink}
          to={`/${user.username}/followers`}
          color={'gray.light'}
          fontSize={'sm'}
        >
          <span style={{ fontWeight: '500' }}>{user.followers.length} </span>
          followers
        </Link>
        {/* <Link color={'gray.light'}>instagram.com</Link> */}
      </Flex>

      <Flex w={'full'} justifyContent={'space-between'}>
        <Flex gap={4} alignItems={'center'}>
          {currentUser?._id === user._id && (
            <Link as={RouterLink} to='/update'>
              <Button
                size={'sm'}
                bg={useColorModeValue('gray.300', 'gray.dark')}
                _hover={{ bg: useColorModeValue('gray.400', 'gray.700') }}
              >
                Edit Profile
              </Button>
            </Link>
          )}
          {currentUser?._id !== user._id && (
            <Button
              size={'sm'}
              onClick={handleFollowUnfollow}
              isLoading={updating}
              bg={useColorModeValue('gray.300', 'gray.dark')}
              _hover={{ bg: useColorModeValue('gray.400', 'gray.700') }}
            >
              {following ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </Flex>
        <Flex>
          <Box
            className='icon-container'
            _hover={{ bg: useColorModeValue('gray.400', 'gray.700') }}
          >
            <BsInstagram size={24} cursor={'pointer'} />
          </Box>
          <Box
            className='icon-container'
            _hover={{ bg: useColorModeValue('gray.400', 'gray.700') }}
          >
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={'pointer'} />
              </MenuButton>
              <Portal>
                <MenuList bg={'gray.dark'}>
                  <MenuItem bg={'gray.dark'} onClick={copyURL}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>

      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1.5px solid'}
          borderColor={grayLightWhite}
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'} color={grayLightWhite}>
            Posts
          </Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={'1px solid'}
          borderColor={gray300GrayLight}
          justifyContent={'center'}
          color={gray400GrayLight}
          pb='3'
          cursor={'pointer'}
        >
          <Text fontWeight={'bold'}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
