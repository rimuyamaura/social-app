import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRecoilValue, useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { BsCheck2All, BsImageFill } from 'react-icons/bs';
import { selectedConversationAtom } from '../atoms/messagesAtom';

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const currentUser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  // console.log('conversation: ', conversation);
  // console.log('lastMessage by: ', lastMessage.sender);

  return (
    <Flex
      gap={4}
      alignItems={'center'}
      p={'1'}
      _hover={{
        cursor: 'pointer',
        bg: useColorModeValue('gray.300', 'gray.dark'),
      }}
      borderRadius={'md'}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
          mock: conversation.mock,
        })
      }
      bg={
        selectedConversation?._id === conversation._id
          ? useColorModeValue('gray.300', 'gray.dark')
          : ''
      }
    >
      <WrapItem>
        <Avatar
          size={{
            base: 'xs',
            sm: 'sm',
            md: 'md',
          }}
          src={user.profilePic}
        >
          {isOnline ? <AvatarBadge boxSize='1em' bg='green.500' /> : ''}
        </Avatar>
      </WrapItem>

      <Stack direction={'column'} fontSize={'sm'}>
        <Text fontWeight={'700'} display={'flex'} alignItems={'center'}>
          {user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
          {currentUser._id === lastMessage.sender ? (
            <Box color={lastMessage.seen ? 'orange.300' : ''}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ''
          )}
          {lastMessage.sender ? (
            lastMessage.text.length > 18 ? (
              lastMessage.text.substring(0, 18) + '...'
            ) : (
              lastMessage.text || <BsImageFill size={16} />
            )
          ) : (
            <Text> start messaging! </Text>
          )}
        </Text>
      </Stack>
    </Flex>
  );
};
export default Conversation;
