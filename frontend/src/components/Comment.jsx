import {
  Avatar,
  Divider,
  Flex,
  Text,
  Link,
  useColorModeValue,
  Box,
  SkeletonCircle,
  Skeleton,
  Spinner,
} from '@chakra-ui/react';
import { DeleteIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { LoadingSkeleton } from '.';
import postsAtom from '../atoms/postsAtom';
import userAtom from '../atoms/userAtom';
import useShowToast from '../hooks/useShowToast';

// TODO ADD name={reply.name} in Avatar, add name field to reply object. So we can see initials of user as if user has no profilepic
const Comment = ({
  reply,
  postId,
  postedBy,
  lastReply = false,
  link = false,
}) => {
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  // postOwner is username of the post owner
  const [postOwner, setPostOwner] = useState(null);

  const gray400Gray700 = useColorModeValue('gray.400', 'gray.700');

  useEffect(() => {
    if (!link) return;
    const getPostOwner = async () => {
      try {
        const res = await fetch(`/api/users/profile/${reply.postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast('An error has occured', data.error, 'error');
          return;
        }
        setPostOwner(data.username);
      } catch (error) {
        showToast('An error has occured', error.message, 'error');
        console.log('Error in getPostOwner: ', error.message);
      }
    };
    getPostOwner();
  }, [postedBy, showToast]);

  const handleDeleteReply = async () => {
    try {
      if (!window.confirm('Are you sure you want to delete this reply?'))
        return;

      // console.log(postId, reply._id);

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

  if (link && !postOwner) return <LoadingSkeleton />;

  // console.log('reply:', reply);

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

          {link && (
            <Link
              as={RouterLink}
              to={`/${postOwner}/post/${postId}`}
              mt={2}
              color={'gray.light'}
              fontSize={'sm'}
            >
              <Text fontSize='sm' color={'gray.light'}>
                <ArrowBackIcon w={3} h={3} /> go to post
              </Text>
            </Link>
          )}
        </Flex>
      </Flex>

      {!lastReply ? <Divider /> : null}
    </>
  );
};
export default Comment;
