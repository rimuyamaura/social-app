import {
  Avatar,
  Divider,
  Flex,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useRecoilValue, useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';

// TODO ADD name={reply.name} in Avatar, add name field to reply object. So we can see initials of user as if user has no profilepic
const Comment = ({ reply, lastReply, postId }) => {
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();

  const gray400Gray700 = useColorModeValue('gray.400', 'gray.700');

  // console.log('reply:', reply);

  const handleDeleteReply = async () => {
    try {
      if (!window.confirm('Are you sure you want to delete this reply?'))
        return;

      const res = await fetch(`/api/posts/reply/${postId}/${reply._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.error) {
        showToast('An error has occured', data.error, 'error');
        return;
      }

      showToast('Success', 'Reply deleted', 'success');
      const updatedPosts = posts.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            replies: post.replies.filter((r) => r._id !== reply._id),
          };
        }
        return post;
      });

      setPosts(updatedPosts);
    } catch (error) {
      showToast('An error has occured', error.message, 'error');
    }
  };

  return (
    <>
      <Flex gap={4} py={2} my={2} w={'full'}>
        <Avatar src={reply.userProfilePic} size={'sm'} name={reply.username} />
        <Flex gap={1} w={'full'} flexDirection={'column'}>
          <Flex
            w={'full'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text fontSize='sm' fontWeight='bold'>
              {reply.username}
            </Text>

            {reply.username === currentUser.username && (
              <DeleteIcon
                color={'gray.light'}
                _hover={{
                  color: gray400Gray700,
                }}
                cursor={'pointer'}
                onClick={handleDeleteReply}
              />
            )}
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
};
export default Comment;
