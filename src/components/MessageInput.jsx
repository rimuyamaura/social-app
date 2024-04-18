import { Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { IoSendSharp } from 'react-icons/io5';

const MessageInput = () => {
  return (
    <Flex gap={2} alignItems={'center'}>
      <form style={{ flex: 95 }}>
        <InputGroup>
          <Input w={'full'} placeholder='Type a message' />
          <InputRightElement cursor={'pointer'}>
            <IoSendSharp />
          </InputRightElement>
        </InputGroup>
      </form>
    </Flex>
  );
};
export default MessageInput;
