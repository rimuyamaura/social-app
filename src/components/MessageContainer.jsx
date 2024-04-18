import {
  Flex,
  Text,
  Avatar,
  Divider,
  Image,
  useColorModeValue,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import Message from './Message';
import MessageInput from './MessageInput';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState, useRecoilValue } from 'recoil';
import { selectedConversationAtom } from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';

const MessageContainer = () => {
  const showToast = useShowToast();
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast('An error has occured', data.error, 'error');
        }
        setMessages(data);
      } catch (error) {
        showToast('An error has occured', error.message, 'error');
      } finally {
        setLoadingMessages(false);
      }
    };

    getMessages();
  }, [showToast, selectedConversation.userId]);

  return (
    <Flex
      flex='70'
      bg={useColorModeValue('gray.200', 'gray.dark')}
      borderRadius={'md'}
      p={2}
      flexDirection={'column'}
    >
      {/* Message header */}
      <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size={'sm'} />
        <Text display={'flex'} alignItems={'center'}>
          {selectedConversation.username}{' '}
          <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider />

      <Flex
        flexDir={'column'}
        gap={4}
        my={4}
        p={2}
        height={'400px'}
        overflowY={'auto'}
      >
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems={'center'}
              p={1}
              borderRadius={'md'}
              alignSelf={i % 2 === 0 ? 'flex-start' : 'flex-end'}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={'column'} gap={2}>
                <Skeleton h='8px' w='250px' />
                <Skeleton h='8px' w='250px' />
                <Skeleton h='8px' w='250px' />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {!loadingMessages &&
          messages.map((message) => (
            <Message
              key={message._id}
              message={message}
              ownMessage={currentUser._id === message.sender}
            />
          ))}
      </Flex>
      <MessageInput />
    </Flex>
  );
};
export default MessageContainer;
