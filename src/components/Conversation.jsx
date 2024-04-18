import {
  Flex,
  useColorModeValue,
  WrapItem,
  Avatar,
  AvatarBadge,
  Stack,
  Text,
  Image,
} from '@chakra-ui/react';
import { useRecoilValue, useRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import { BsCheck2All } from 'react-icons/bs';
import { selectedConversationAtom } from '../atoms/messagesAtom';

const Conversation = ({ conversation }) => {
  const currentUser = useRecoilValue(userAtom);
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  console.log('selected', selectedConversation);
  return (
    <Flex
      gap={4}
      alignItems={'center'}
      p={'1'}
      _hover={{
        cursor: 'pointer',
        bg: useColorModeValue('gray.600', 'gray.dark'),
        color: 'white',
      }}
      borderRadius={'md'}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          username: user.username,
          userProfilePic: user.profilePic,
        })
      }
      bg={
        selectedConversation._id === conversation._id
          ? useColorModeValue('gray.400', 'gray.dark')
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
          <AvatarBadge boxSize='1em' bg='green.500' />
        </Avatar>
      </WrapItem>

      <Stack direction={'column'} fontSize={'sm'}>
        <Text fontWeight={'700'} display={'flex'} alignItems={'center'}>
          {user.username} <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
          {currentUser._id === lastMessage.sender ? (
            <BsCheck2All size={16} />
          ) : (
            ''
          )}
          {lastMessage.text.length > 18
            ? lastMessage.text.substring(0, 18) + '...'
            : lastMessage.text}
        </Text>
      </Stack>
    </Flex>
  );
};
export default Conversation;
