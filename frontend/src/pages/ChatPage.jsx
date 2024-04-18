import {
  Box,
  Flex,
  Input,
  Button,
  Text,
  useColorModeValue,
  Skeleton,
  SkeletonCircle,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Conversation, MessageContainer } from '../components';
import { GiConversation } from 'react-icons/gi';
import { useEffect, useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useRecoilState } from 'recoil';
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';

const ChatPage = () => {
  const showToast = useShowToast();
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch('/api/messages/conversations');
        const data = await res.json();
        if (data.error) {
          showToast('An error has occured', data.error, 'error');
          return;
        }

        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast('An error has occured', error.message, 'error');
      } finally {
        setLoadingConversations(false);
      }
    };

    getConversations();
  }, [showToast, setConversations]);

  return (
    <Box
      position={'absolute'}
      left={'50%'}
      w={{ base: '100%', md: '80%', lg: '750px' }}
      p={4}
      transform={'translateX(-50%)'}
    >
      <Flex
        gap={4}
        flexDirection={{ base: 'column', md: 'row' }}
        maxW={{
          sm: '400px',
          md: 'full',
        }}
        mx={'auto'}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={'column'}
          maxW={{ sm: '250px', md: 'full' }}
          mx={'auto'}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue('gray.600', 'gray.400')}
          >
            Your Conversations
          </Text>

          <form>
            <Flex alignItems={'center'} gap={2}>
              <Input placeholder='Search for a user' />
              <Button size={'sm'}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations &&
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={'center'}
                p={'1'}
                borderRadius={'md'}
              >
                <Box>
                  <SkeletonCircle size={'10'} />
                </Box>
                <Flex w={'full'} flexDirection={'column'} gap={3}>
                  <Skeleton h={'10px'} w={'80px'} />
                  <Skeleton h={'8px'} w={'90%'} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
              />
            ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={'md'}
            p={2}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            height={'400px'}
          >
            <GiConversation size={100} />
            <Text fontSize={20}>Select a conversation to get started</Text>
          </Flex>
        )}

        {selectedConversation._id && <MessageContainer />}
      </Flex>
    </Box>
  );
};

export default ChatPage;