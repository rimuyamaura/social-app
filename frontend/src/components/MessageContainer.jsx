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
import { useEffect, useRef, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';
import userAtom from '../atoms/userAtom';
import { useSocket } from '../context/SocketContext';
import messageSound from '../assets/alert.mp3';

const MessageContainer = () => {
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const currentUser = useRecoilValue(userAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const { socket } = useSocket();
  const lastMessageRef = useRef(null);
  const showToast = useShowToast();

  useEffect(() => {
    socket.on('newMessage', (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }

      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play();
      }

      setConversations((prevConversations) => {
        const updatedConversations = prevConversations.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off('newMessage');
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const lastMessageIsFromOtherUser =
      messages.length &&
      messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit('markMessagesAsSeen', {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on('messagesSeen', ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) => {
          const updatedMessages = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true,
              };
            }
            return message;
          });
          return updatedMessages;
        });
      }
    });
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
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
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  console.log(selectedConversation);

  return (
    <Flex
      flex='70'
      bg={useColorModeValue('gray.200', 'gray.dark')}
      borderRadius={'md'}
      p={2}
      flexDirection={'column'}
    >
      <Flex w={'full'} h={12} alignItems={'center'} gap={2}>
        <Avatar
          src={selectedConversation.userProfilePic}
          size={'sm'}
          name={selectedConversation.username}
          // textColor={useColorModeValue('black', 'white')}
          // border={'2px solid'}
          // borderColor={useColorModeValue('gray.200', 'gray.600')}
        />
        <Text display={'flex'} alignItems={'center'}>
          {selectedConversation.username}{' '}
          <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider borderColor={useColorModeValue('gray.400', 'gray.600')} />

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
            <Flex
              key={message._id}
              direction={'column'}
              ref={
                messages.length - 1 === messages.indexOf(message)
                  ? lastMessageRef
                  : null
              }
            >
              <Message
                key={message._id}
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </Flex>
          ))}
      </Flex>
      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};
export default MessageContainer;
