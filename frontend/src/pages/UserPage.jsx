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
  const [fetchingPosts, setFetchingPosts] = useState(true);

  const [content, setContent] = useState('posts');

  const gray300GrayLight = useColorModeValue('gray.300', 'gray.light');
  const gray400GrayLight = useColorModeValue('gray.400', 'gray.light');
  const grayLightWhite = useColorModeValue('gray.light', 'white');

  useEffect(() => {
    const getPosts = async () => {
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        showToast('An error has occured', error.message, 'error');
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [username, showToast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent='center'>
        <Spinner size='xl' />
      </Flex>
    );
  }
  if (!user && !loading) return <h1> User not found</h1>;

  return (
    <>
      <UserHeader user={user} />
      <Flex w={'full'}>
        <Flex
          flex={1}
          borderBottom={'1.5px solid'}
          borderColor={content === 'posts' ? grayLightWhite : gray300GrayLight}
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
        >
          {content === 'posts' ? (
            <Text fontWeight={'bold'} color={grayLightWhite}>
              Posts
            </Text>
          ) : (
            <Text
              fontWeight={'bold'}
              color={gray400GrayLight}
              onClick={() => setContent('posts')}
            >
              Posts
            </Text>
          )}
        </Flex>
        <Flex
          flex={1}
          borderBottom={'1.5px solid'}
          borderColor={content === 'posts' ? gray300GrayLight : grayLightWhite}
          justifyContent={'center'}
          pb='3'
          cursor={'pointer'}
        >
          {content === 'replies' ? (
            <Text fontWeight={'bold'} color={grayLightWhite}>
              Replies
            </Text>
          ) : (
            <Text
              fontWeight={'bold'}
              color={gray400GrayLight}
              onClick={() => setContent('replies')}
            >
              Replies
            </Text>
          )}
        </Flex>
      </Flex>

      {content === 'posts' && !fetchingPosts && posts.length === 0 && (
        <h1>User has not posted.</h1>
      )}
      {content === 'posts' && fetchingPosts && (
        <Flex justifyContent='center' my={12}>
          <Spinner size='xl' />
        </Flex>
      )}
      {content === 'posts' &&
        posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      {content === 'replies' && <h1>To be implemented in the future!</h1>}
      {/* NEED a way to fetch all user comments with reply object, postID, *lastReply can be set manually)  */}
    </>
  );
};
export default UserPage;
