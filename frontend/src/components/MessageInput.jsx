import { Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { IoSendSharp } from 'react-icons/io5';
import { useState } from 'react';
import useShowToast from '../hooks/useShowToast';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) return;

    try {
      const res = await fetch('api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast('An error has occured', data.error, 'error');
        return;
      }

      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });

      setMessageText('');
    } catch (error) {
      showToast('An error has occured', error.message, 'error');
    }
  };
  return (
    <Flex gap={2} alignItems={'center'} onSubmit={handleSendMessage}>
      <form style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={'full'}
            placeholder='Type a message'
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
          />
          <InputRightElement cursor={'pointer'} onClick={handleSendMessage}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>
    </Flex>
  );
};
export default MessageInput;
