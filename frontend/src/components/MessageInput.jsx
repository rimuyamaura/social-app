import {
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Image,
  Spinner,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import useShowToast from '../hooks/useShowToast';
import usePreviewImg from '../hooks/usePreviewImg';
import {
  conversationsAtom,
  selectedConversationAtom,
} from '../atoms/messagesAtom';
import { BsFillImageFill } from 'react-icons/bs';
import { IoSendSharp } from 'react-icons/io5';

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState('');
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const showToast = useShowToast();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const res = await fetch('api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img: imgUrl,
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
      setImgUrl('');
    } catch (error) {
      showToast('An error has occured', error.message, 'error');
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Flex gap={2} alignItems={'center'}>
      <form style={{ flex: 95 }} onSubmit={handleSendMessage}>
        <InputGroup>
          <Input
            w={'full'}
            placeholder='Type a message'
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
            border={'1px solid'}
            borderColor={useColorModeValue('gray.300', 'gray.700')}
            _hover={{
              borderColor: useColorModeValue('gray.400', 'gray.600'),
            }}
          />
          <InputRightElement cursor={'pointer'} onClick={handleSendMessage}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>

      <Flex flex={5} cursor={'pointer'}>
        <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        <Input
          type={'file'}
          hidden
          ref={imageRef}
          onChange={handleImageChange}
        />
      </Flex>
      <Modal
        isOpen={imgUrl}
        onClose={() => {
          onClose();
          setImgUrl('');
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex mt={5} w={'full'}>
              <Image src={imgUrl} />
            </Flex>
            <Flex justifyContent={'flex-end'} my={2}>
              {!isSending ? (
                <IoSendSharp
                  size={24}
                  cursor={'pointer'}
                  onClick={handleSendMessage}
                />
              ) : (
                <Spinner size={'md'} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
export default MessageInput;
