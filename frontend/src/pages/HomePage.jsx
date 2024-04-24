import { Box, Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { Post, SuggestedUsers } from '../components';
import { useRecoilState } from 'recoil';
import postsAtom from '../atoms/postsAtom';

const Home = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setPosts([]);
      setLoading(true);
      try {
        const res = await fetch('/api/posts/feed');
        const data = await res.json();

        if (data.error) {
          showToast('An error has occured', data.error, 'error');
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast('An error has occured', error.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap={10} alignItems={'flex-start'}>
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <h1>Follow some users to see the feed</h1>
        )}

        {loading && (
          <Flex justifyContent='center'>
            <Spinner size='xl' />
          </Flex>
        )}

        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      <Box
        flex={30}
        display={{
          base: 'none',
          md: 'block',
        }}
      >
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};
export default Home;
