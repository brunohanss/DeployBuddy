import { useState } from 'react';
import { Box, Button, Input, VStack, Heading, Divider } from '@chakra-ui/react';
import useNotifications from '../hooks/useNotifications';
import { Provider } from '@supabase/supabase-js';
import useAuth from '../hooks/useAuth';

const Signin = () => {
  const [email, setEmail] = useState('');
  const { signInWithEmail, signInWithProvider } = useAuth();
  const showNotification = useNotifications();

  const handleSigninWithEmail = async () => {
    await signInWithEmail(email);
  };

  const handleSigninWithProvider = async (provider: Provider) => {
    await signInWithProvider(provider);
  };

  return (
    <Box w="100vw" h="100vh" display="flex" alignItems="center" justifyContent="center" bg="primary.200">
      <VStack spacing={4} p={8} bg="white" rounded="md" shadow="lg">
        <Heading as="h1" size="lg" color="primary.100">Sign In / Sign Up</Heading>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button colorScheme="teal" onClick={handleSigninWithEmail}>Sign In with Email</Button>
        <Divider />
        <Button colorScheme="teal" onClick={() => handleSigninWithProvider('google')}>Sign In with Google</Button>
        <Button colorScheme="teal" onClick={() => handleSigninWithProvider('github')}>Sign In with GitHub</Button>
        <Button colorScheme="teal" onClick={() => handleSigninWithProvider('gitlab')}>Sign In with GitLab</Button>
        <Button colorScheme="teal" onClick={() => handleSigninWithProvider('bitbucket')}>Sign In with BitBucket</Button>
      </VStack>
    </Box>
  );
};

export default Signin;
