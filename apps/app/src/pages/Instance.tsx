import { useEffect, useState } from 'react';
import { Box, Button, Heading, VStack, Text } from '@chakra-ui/react';
import { useLocation, useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { encrypt } from '../services/Crypto';
interface Module {
  id: number;
  name: string;
}
const InstancePage = () => {
  const { id } = useParams();
  const { user, jwtToken } = useAuth();
  const [avalableModules, setAvailableModules] = useState([] as Module[]);
  const [modules, setModules] = useState([] as Module[]);
  const location = useLocation();
  const instanceId = location.pathname.split('/').pop() ?? 'undefined';

  useEffect(() => {
    updateModules();
  }, []);
  const updateModules = async () => {
    if (!user?.id || !jwtToken) {
      // Should navigate to sign in
      return null;
    }
    const modules = await fetch(`http://localhost:3000/modules/${user?.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${encrypt(jwtToken)}`
      },
    });
    setModules(await modules.json());
  }

  const handleAddService = async (instanceId: string,moduleName: string) => {
    if (!user?.id || !jwtToken) {
      // Should navigate to sign in
      return null;
    }
    const modules = await fetch(`http://localhost:3000/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${encrypt(jwtToken)}`
      },
      body: JSON.stringify({
        instanceId,
        moduleName,
        userId: user?.id
      })
    });
  };

  const handleRemoveService = (serviceId: number) => {
    // Logic to remove a service
  };

  return (
    <Box w="100vw" h="100vh" p={8} bg="primary.200">
      <VStack spacing={4} alignItems="flex-start">
        <Heading as="h1" size="lg" color="primary.100">Modules in Instance</Heading>
        <Button colorScheme="teal" onClick={() => {handleAddService(instanceId, 'FullStack Monitor')}}>Add Service</Button>
        {modules?.map((service: Module) => (
          <Box key={service.id} p={4} bg="white" w="100%" rounded="md" shadow="md">
            <Text>{service.name}</Text>
            <Button colorScheme="red" onClick={() => handleRemoveService(service.id)}>Remove</Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default InstancePage;
