import {
  Flex,
  Link,
  useColorMode,
  IconButton,
  Grid,
  GridItem,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChatIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import authScreenAtom from '../atoms/authAtom';
import useLogout from '../hooks/useLogout';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { AiFillHome } from 'react-icons/ai';

const Header = () => {
  const user = useRecoilValue(userAtom);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const { colorMode, toggleColorMode } = useColorMode();
  const logout = useLogout();

  return (
    <Grid
      templateColumns='repeat(3, 1fr)'
      position={'fixed'}
      top={0}
      left={'50%'}
      transform={'translateX(-50%)'}
      width={{ base: '100%', lg: '900px' }}
      px={10}
      pt={3}
      pb={2}
      zIndex={999}
      bg={useColorModeValue('gray.100', '#101010')}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.800')}
    >
      <GridItem w='100%' h='10' display='flex' alignItems='center'>
        {user && (
          <Link as={RouterLink} to={`/${user.username}`}>
            <FaRegUserCircle size={24} />
          </Link>
        )}
        {!user && (
          <Link
            as={RouterLink}
            to={'/auth'}
            onClick={() => setAuthScreen('login')}
          >
            Login
          </Link>
        )}
      </GridItem>

      <GridItem
        w='100%'
        h='10'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        {user && (
          <>
            <Link as={RouterLink} to='/'>
              <AiFillHome size={24} />
            </Link>
          </>
        )}
        {!user && (
          <>
            {colorMode === 'dark' ? (
              <MoonIcon
                w={5}
                h={5}
                cursor={'pointer'}
                onClick={toggleColorMode}
              />
            ) : (
              <SunIcon
                w={5}
                h={5}
                cursor={'pointer'}
                onClick={toggleColorMode}
              />
            )}
          </>
        )}
      </GridItem>

      <GridItem
        w='100%'
        h='10'
        display='flex'
        justifyContent='end'
        alignItems='center'
      >
        {user && (
          <Flex alignItems={'center'} gap={{ base: '4', md: '6' }}>
            <Link as={RouterLink} to={'/chat'}>
              <ChatIcon w={5} h={5} mt={'-2px'} />
            </Link>
            {colorMode === 'dark' ? (
              <MoonIcon
                w={5}
                h={5}
                cursor={'pointer'}
                onClick={toggleColorMode}
              />
            ) : (
              <SunIcon
                w={5}
                h={5}
                cursor={'pointer'}
                onClick={toggleColorMode}
              />
            )}
            <IconButton
              aria-label='Logout'
              icon={<FiLogOut size={20} />}
              colorScheme={'green'}
              size={'xs'}
              p={1}
              onClick={logout}
            />
          </Flex>
        )}
        {!user && (
          <Link
            as={RouterLink}
            to={'/auth'}
            onClick={() => setAuthScreen('signup')}
          >
            Sign Up
          </Link>
        )}
      </GridItem>
    </Grid>
  );
};
export default Header;
