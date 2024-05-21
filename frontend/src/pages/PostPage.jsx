import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Image,
  Divider,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Actions, Comment, EditPostBtn } from '../components';
import useGetUserProfile from '../hooks/useGetUserProfile';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';
import { formatDistanceToNow } from 'date-fns';

const PostPage = () => {
  const currentUser = useRecoilValue(userAtom);
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { pid } = useParams();
  const showToast = useShowToast();
  const navigate = useNavigate();
  const currentPost = posts[0];

  const gray400Gray700 = useColorModeValue('gray.400', 'gray.700');

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast('An error has occured', data.error, 'error');
          return;
        }

        setPosts([data]);
      } catch (error) {
        showToast('An error has occured', error.message, 'error');
      }
    };
    getPost();
  }, [pid, showToast, setPosts]);

  const handleDeletePost = async () => {
    try {
      if (!window.confirm('Are you sure you want to delete this post?')) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.error) {
        showToast('An error has occured', data.error, 'error');
        return;
      }
      showToast('Success', 'Post deleted', 'success');
      navigate(`/${user.username}`);
    } catch (error) {
      showToast('An error has occured', error.message, 'error');
    }
  };

  if (!user && loading) {
    return (
      <Flex justifyContent='center'>
        <Spinner size='xl' />
      </Flex>
    );
  }

  if (!currentPost) return null;
  console.log('POST', currentPost);

  return (
    <>
      <Flex>
        <Flex w={'full'} alignItems={'center'} gap={3}>
          <Avatar src={user.profilePic} size={'md'} name={user.username} />
          <Flex>
            <Text fontSize={'sm'} fontWeight={'bold'}>
              {user.username}
            </Text>
            <Image src='/verified.png' w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={2} alignItems={'center'}>
          <Text
            fontSize={'xs'}
            width={36}
            textAlign={'right'}
            color={'gray.light'}
            mx={2}
          >
            {formatDistanceToNow(new Date(currentPost.createdAt))} ago
          </Text>

          {currentUser?._id === user._id && (
            <>
              <EditPostBtn post={currentPost} />
              <DeleteIcon
                size={20}
                color={'gray.light'}
                _hover={{
                  color: gray400Gray700,
                }}
                cursor={'pointer'}
                onClick={handleDeletePost}
              />
            </>
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currentPost.text}</Text>

      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={'hidden'}
          border={'1px solid'}
          borderColor={'gray.light'}
        >
          <Image src={currentPost.img} w={'full'} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>

      <Divider my={4} />

      {!currentUser && (
        <>
          <Flex justifyContent={'space-between'}>
            <Flex gap={2} alignItems={'center'}>
              <Text fontSize={'2xl'}>👋</Text>
              <Text color={'gray.light'}>Login to like, reply and post.</Text>
            </Flex>
          </Flex>

          <Divider my={4} />
        </>
      )}

      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};
export default PostPage;
