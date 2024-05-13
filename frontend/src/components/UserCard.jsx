import { Flex, WrapItem, Avatar } from '@chakra-ui/react';

const UserCard = ({ user }) => {
  return (
    <>
      <WrapItem>
        <Avatar
          size={{
            base: 'xs',
            sm: 'sm',
            md: 'md',
          }}
          src={user.profilePic}
          name={user.name}
        ></Avatar>
      </WrapItem>
      <Flex></Flex>
    </>
  );
};
export default UserCard;
