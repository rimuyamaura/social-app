import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';
import postsAtom from '../atoms/postsAtom';

const MAX_CHAR = 500;

const CreatePost = () => {
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(false);
  const [postText, setPostText] = useState('');
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const { username } = useParams();
  const imageRef = useRef(null);
  const showToast = useShowToast();

  const gray400GrayDark = useColorModeValue('gray.400', 'gray.dark');

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText || '',
          img: imgUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        useShowToast('An error has occured', data.error, 'error');
        return;
      }
      showToast('Success', 'Your post has been created', 'success');
      if (username === user.username) {
        setPosts([data, ...posts]);
      }

      onClose();
      setPostText('');
      setImgUrl('');
    } catch (error) {
      // showToast('An error has occured', error.message, 'error');
      showToast(
        'An error has occured',
        'Please make sure you have input all areas correctly',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        position={'fixed'}
        bottom={10}
        right={5}
        // bg={useColorModeValue('gray.300', 'gray.dark')}
        onClick={onOpen}
        size={{ base: 'sm', sm: 'md' }}
        colorScheme={'blue'}
      >
        <AddIcon />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent bg={useColorModeValue('white', 'gray.dark')}>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder='Post content goes here..'
                onChange={handleTextChange}
                value={postText}
              />
              <Text
                fontSize='xs'
                fontWeight='bold'
                textAlign={'right'}
                m={'1'}
                color={useColorModeValue('gray.400', 'gray.900')}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type='file'
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              <BsFillImageFill
                style={{ marginLeft: '5px', cursor: 'pointer' }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {imgUrl && (
              <Flex mt={5} w={'full'} position={'relative'}>
                <Image src={imgUrl} alt='Selected img' />
                <CloseButton
                  onClick={() => {
                    setImgUrl('');
                  }}
                  position={'absolute'}
                  top={2}
                  right={2}
                  bg={useColorModeValue('gray.200', 'gray.700')}
                  _hover={{ bg: gray400GrayDark }}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={'blue'}
              mr={2}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreatePost;
