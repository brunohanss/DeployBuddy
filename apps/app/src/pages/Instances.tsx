import { useState, useEffect, useRef } from 'react';
import { 
  Box, Button, Heading, VStack, Text, Drawer, DrawerBody, DrawerFooter, 
  DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Input, 
  FormLabel, Textarea, Stack, useDisclosure 
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import useAuth from '../hooks/useAuth';
import useNotifications from '../hooks/useNotifications';
import SupabaseService from '../services/SSHCredentials';
import { encrypt } from '../services/Crypto';
import Instance from '../components/Instance';
export interface Instance {
  id: number;
  created_at: string;
  user_id: string;
  name: string;
  ssh_command: string;
  status: 'active' | 'inactive' | 'pending' | 'unauthorized';
  uuid: string;
  private_key?: string;
  public_key?: string;
}

const InstancesPage = () => {
  const [instances, setInstances] = useState([] as Instance[]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [sshCommand, setSshCommand] = useState('');
  const showNotification = useNotifications();
  const { user, jwtToken } = useAuth();
  const { createSshCommand } = SupabaseService();

  useEffect(() => {
    updateInstances()

  }, [user]);

  const updateInstances = async () => {
    console.log("user", user)
    if (!user?.id || ! jwtToken) {
      // Should navigate to sign in
      return null;
    }
    const instances = await fetch(`http://localhost:3000/instances/${user?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${encrypt(jwtToken)}`
      },
    });
    setInstances(await instances.json());
  }

  const handleAddInstance = async () => {
    try {
      console.log('handleAddInstance');
      await createSshCommand(user.id, name, sshCommand);

      await updateInstances();
      
      onClose();
      // Fetch updated instances from your backend
    } catch (error) {
      showNotification('Error', 'Failed to add container' + error, 'error');
    }
  };

  const handleRemoveInstance = (id: string) => {
    // Logic to remove a container
  };

  return (
    <Box w="100vw" h="100vh" p={8} bg="primary.200">
      <VStack spacing={4} alignItems="flex-start">
        <Heading as="h1" size="lg" color="primary.100">Connected Instances</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>Add Instance</Button>
        {instances.map((instance) => (
          <Instance instance={instance} key={instance?.id} onRemove={function (id: number) {
            throw new Error('Function not implemented.');
          } } />
        ))}
      </VStack>

      {/* Drawer Component */}
      <Drawer isOpen={isOpen} placement="right" initialFocusRef={firstField} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Create a new container</DrawerHeader>
          <DrawerBody>
            <Stack spacing="24px">
              <Box>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  ref={firstField}
                  id="name"
                  placeholder="Please enter container name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="description">Description</FormLabel>
                <Textarea
                  id="description"
                  placeholder="Please enter container description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="tags">Tags</FormLabel>
                <Input
                  id="tags"
                  placeholder="Please enter tags separated by commas"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="sshCommand">SSH Command</FormLabel>
                <Textarea
                  id="sshCommand"
                  placeholder="Please enter SSH Command"
                  value={sshCommand}
                  onChange={(e) => setSshCommand(e.target.value)}
                />
              </Box>
            </Stack>
          </DrawerBody>
          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={handleAddInstance}>Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default InstancesPage;
