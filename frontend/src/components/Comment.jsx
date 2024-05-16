import { Avatar, Divider, Flex, Text } from '@chakra-ui/react';

// ADD name={reply.name} in Avatar, add name field to reply object. So we can see initials of user as if user has no profilepic
const Comment = ({ reply, lastReply }) => {
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
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>
      {!lastReply ? <Divider /> : null}
    </>
  );
};
export default Comment;
