import { Flex, Avatar, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  return (
    <>
      <Flex
        gap={4}
        alignItems={'center'}
        p={4}
        _hover={{
          cursor: 'pointer',
          bg: useColorModeValue('gray.200', 'gray.dark'),
        }}
        onClick={() => navigate(`/${user.username}`)}
      >
        <Avatar size={'lg'} src={user.profilePic} name={user.username}></Avatar>
        <Stack direction={'column'} fontSize={'sm'}>
          <Flex gap={2}>
            <Text fontWeight={'700'} display={'flex'} alignItems={'center'}>
              {user.name}
            </Text>
            <Text
              fontSize={'xs'}
              display={'flex'}
              alignItems={'center'}
              bg={useColorModeValue('gray.300', 'gray.dark')}
              color={useColorModeValue('gray.dark', 'gray.400')}
              p={0.5}
              px={2}
              borderRadius={'full'}
            >
              @{user.username}
            </Text>
          </Flex>
          <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
            {user.bio}
          </Text>
        </Stack>
      </Flex>
    </>
  );
};
export default UserCard;
