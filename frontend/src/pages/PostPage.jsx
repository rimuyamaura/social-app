import {
  Box,
  Flex,
  Text,
  Avatar,
  Image,
  Button,
  Divider,
} from '@chakra-ui/react';
import { BsThreeDots } from 'react-icons/bs';
import { useState } from 'react';
import { Actions, Comment } from '../components';

const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src='zuck-avatar.png' size={'md'} name='Mark Zuckerberg' />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>
              markzuckerberg
            </Text>
            <Image src='/verified.png' w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={'center'}>
          <Text
            fontSize={'xs'}
            width={36}
            textAlign={'right'}
            color={'gray.light'}
          >
            1d ago
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>
      <Text my={3}>Let's talk about Threads.</Text>

      <Box
        borderRadius={6}
        overflow={'hidden'}
        border={'1px solid'}
        borderColor={'gray.light'}
      >
        <Image src='/post1.png' w={'full'} />
      </Box>
      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>
      <Flex gap={2} alignItems={'center'}>
        <Text color={'gray.light'} fontSize='sm'>
          530 replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={'full'} bg={'gray.light'}></Box>
        <Text color={'gray.light'} fontSize='sm'>
          743 likes
        </Text>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={'space-between'}>
        <Flex gap={2} alignItems={'center'}>
          <Text fontSize={'2xl'}>👋</Text>
          <Text color={'gray.light'}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      <Comment
        comment='Looks really good!'
        createdAt='2d'
        likes='95'
        username='johndoe'
        userAvatar='https://bit.ly/dan-abramov'
      />
      <Comment
        comment='Great work!'
        createdAt='1d'
        likes='21'
        username='janedoe'
        userAvatar='https://bit.ly/code-beast'
      />
      <Comment
        comment='Nice!'
        createdAt='5d'
        likes='42'
        username='sally'
        userAvatar='https://bit.ly/sage-adebayo'
      />
    </>
  );
};
export default PostPage;
