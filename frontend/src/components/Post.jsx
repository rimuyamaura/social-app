import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  Avatar,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import { Actions, EditPostBtn } from '../components';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { DeleteIcon } from '@chakra-ui/icons';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const navigate = useNavigate();

  const gray400Gray700 = useColorModeValue('gray.400', 'gray.700');

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch('/api/users/profile/' + postedBy);
        const data = await res.json();
        if (data.error) {
          showToast('An error has occured', data.error, 'error');
          return;
        }
        setUser(data);
      } catch (error) {
        showToast('An error has occured', error.message, 'error');
        setUser(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm('Are you sure you want to delete this post?')) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.error) {
        showToast('An error has occured', data.error, 'error');
        return;
      }
      showToast('Success', 'Post deleted', 'success');
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast('An error has occured', error.message, 'error');
    }
  };

  if (!user) return null;
  // console.log(post);

  return (
    <>
      <Link to={`/${user.username}/post/${post._id}`}>
        <Flex gap={3} mb={4} py={5}>
          <Flex flexDirection={'column'} alignItems={'center'}>
            <Avatar
              size='md'
              name={user.username}
              src={user?.profilePic}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/${user.username}`);
              }}
            />
            <Box w={'1px'} h={'full'} bg={'gray.light'} my={2}></Box>
            <Box position={'relative'} w={'full'}>
              {post.replies.length === 0 && (
                <Text textAlign='center'> 🥱 </Text>
              )}
              {post.replies[0] && (
                <Avatar
                  size='xs'
                  name={post.replies[0].username}
                  src={post.replies[0].userProfilePic}
                  position={'absolute'}
                  top={'0px'}
                  left={'15px'}
                  padding={'2px'}
                />
              )}
              {post.replies[1] && (
                <Avatar
                  size='xs'
                  name={post.replies[1].username}
                  src={post.replies[1].userprofilePic}
                  position={'absolute'}
                  top={'0px'}
                  right={'-5px'}
                  padding={'2px'}
                />
              )}
              {post.replies[2] && (
                <Avatar
                  size='xs'
                  name={post.replies[2].username}
                  src={post.replies[2].userprofilePic}
                  position={'absolute'}
                  top={'0px'}
                  left={'4px'}
                  padding={'2px'}
                />
              )}
            </Box>
          </Flex>
          <Flex flex={1} flexDirection={'column'} gap={2}>
            <Flex justifyContent={'space-between'} w={'full'}>
              <Flex w={'full'} alignItems={'center'}>
                <Text
                  fontSize={'sm'}
                  fontWeight={'bold'}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/${user.username}`);
                  }}
                >
                  {user?.username}
                </Text>
                <Image src='/verified.png' w={4} h={4} ml={1} />
              </Flex>
              <Flex gap={1} alignItems={'center'}>
                <Text
                  fontSize={'xs'}
                  width={36}
                  textAlign={'right'}
                  color={'gray.light'}
                  mx={1}
                >
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </Text>

                {currentUser?._id === user._id && (
                  <>
                    <EditPostBtn post={post} />
                    <DeleteIcon
                      color={'gray.light'}
                      _hover={{
                        color: gray400Gray700,
                      }}
                      onClick={handleDeletePost}
                    />
                  </>
                )}
              </Flex>
            </Flex>

            <Text fontSize={'sm'}>{post.text}</Text>

            {post.img && (
              <Box
                borderRadius={6}
                overflow={'hidden'}
                border={'1px solid'}
                borderColor={'gray.light'}
              >
                <Image src={post.img} w={'full'} />
              </Box>
            )}

            <Flex gap={3} my={1}>
              <Actions post={post} />
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </>
  );
};

export default Post;
