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
import { EditIcon } from '@chakra-ui/icons';
import { useEffect, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewImg from '../hooks/usePreviewImg';
import useShowToast from '../hooks/useShowToast';
import postsAtom from '../atoms/postsAtom';

const MAX_CHAR = 500;

const EditPostBtn = ({ post }) => {
  const [loading, setLoading] = useState(false);

  const [postText, setPostText] = useState(post.text);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const showToast = useShowToast();

  const gray400Gray700 = useColorModeValue('gray.400', 'gray.700');
  const gray400GrayDark = useColorModeValue('gray.400', 'gray.dark');

  useEffect(() => {
    if (post.img) {
      setImgUrl(post.img);
    }
  }, [post.img]);

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

  const handleEditPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/edit/${post._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: postText,
          img: imgUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast('An error has occured', data.error, 'error');
        return;
      }

      showToast('Success', 'Your post has been updated', 'success');

      const updatedPosts = posts.map((p) => (p._id === data._id ? data : p));

      setPosts(updatedPosts);
      onClose();
    } catch (err) {
      console.error(err);
      showToast('Failed to edit post', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <EditIcon
        color={'gray.light'}
        _hover={{
          color: gray400Gray700,
        }}
        onClick={(e) => {
          e.preventDefault();
          onOpen();
        }}
        cursor={'pointer'}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent bg={useColorModeValue('white', 'gray.dark')}>
          <ModalHeader>Edit Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea onChange={handleTextChange} value={postText} />
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
              colorScheme='green'
              mr={2}
              onClick={handleEditPost}
              isLoading={loading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default EditPostBtn;
