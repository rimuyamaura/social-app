import { Flex, Spinner, Text, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { UserHeader, Post, Comment } from '../components';
import useShowToast from '../hooks/useShowToast';
import useGetUserProfile from '../hooks/useGetUserProfile';
import postsAtom from '../atoms/postsAtom';

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [replies, setReplies] = useState([]);
  const [fetching, setFetching] = useState(true);

  const [contentToShow, setContentToShow] = useState('posts');

  const gray300GrayLight = useColorModeValue('gray.300', 'gray.light');
  const gray400GrayLight = useColorModeValue('gray.400', 'gray.light');
  const grayLightWhite = useColorModeValue('gray.light', 'white');

  useEffect(() => {
    if (contentToShow === 'posts') {
      const getPosts = async () => {
        setFetching(true);
        try {
          const res = await fetch(`/api/posts/user/${username}`);
          const data = await res.json();
          setPosts(data);
        } catch (error) {
          showToast('An error has occured', error.message, 'error');
          setPosts([]);
        } finally {
          setFetching(false);
        }
      };
      getPosts();
    } else {
      const getReplies = async () => {
        setFetching(true);
        try {
          const res = await fetch(`/api/posts/reply/${username}`);
          const data = await res.json();
          setReplies(data);
        } catch (error) {
          showToast('An error has occured', error.message, 'error');
          setReplies([]);
        } finally {
          setFetching(false);
        }
      };
      getReplies();
    }
  }, [username, contentToShow, showToast, setPosts, setReplies]);

  if (!user && loading) {
    return (
      <Flex justifyContent='center'>
        <Spinner size='xl' />
      </Flex>
    );
  }
  if (!user && !loading) return <h1> User not found</h1>;

  // console.log('replies:', replies);

  return (
    <>
      <UserHeader user={user} />
      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1.5px solid'}
          borderColor={
            contentToShow === 'posts' ? grayLightWhite : gray300GrayLight
          }
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
          onClick={() => setContentToShow('posts')}
        >
          {contentToShow === 'posts' ? (
            <Text fontWeight={'bold'} color={grayLightWhite}>
              Posts
            </Text>
          ) : (
            <Text fontWeight={'bold'} color={gray400GrayLight}>
              Posts
            </Text>
          )}
        </Flex>
        <Flex
          flex={1}
          borderBottom={'1.5px solid'}
          borderColor={
            contentToShow === 'posts' ? gray300GrayLight : grayLightWhite
          }
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
          onClick={() => setContentToShow('replies')}
        >
          {contentToShow === 'replies' ? (
            <Text fontWeight={'bold'} color={grayLightWhite}>
              Replies
            </Text>
          ) : (
            <Text fontWeight={'bold'} color={gray400GrayLight}>
              Replies
            </Text>
          )}
        </Flex>
      </Flex>

      {fetching && (
        <Flex justifyContent='center' my={12}>
          <Spinner size='xl' />
        </Flex>
      )}

      {contentToShow === 'posts' && !fetching && posts.length === 0 && (
        <h1>User has not posted.</h1>
      )}
      {contentToShow === 'posts' &&
        !fetching &&
        posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}

      {contentToShow === 'replies' && !fetching && replies.length === 0 && (
        <h1>User has not replied to any posts.</h1>
      )}
      {contentToShow === 'replies' &&
        !fetching &&
        replies.map((reply) => (
          <Comment
            key={reply._id}
            reply={reply}
            postId={reply.postId}
            postedBy={reply.postedBy}
            link={true}
          />
        ))}
    </>
  );
};
export default UserPage;
