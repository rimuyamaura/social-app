import { Box, Flex, Skeleton, SkeletonCircle } from '@chakra-ui/react';

const LoadingSkeleton = () => {
  return (
    <Flex gap={4} alignItems={'center'} p={'7'} borderRadius={'md'}>
      <Box>
        <SkeletonCircle size={'10'} />
      </Box>
      <Flex w={'full'} flexDirection={'column'} gap={3}>
        <Skeleton h={'10px'} w={'80px'} />
        <Skeleton h={'8px'} w={'100%'} />
      </Flex>
    </Flex>
  );
};
export default LoadingSkeleton;
