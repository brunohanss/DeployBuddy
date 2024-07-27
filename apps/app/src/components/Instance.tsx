import React, { useRef } from 'react';
import { 
  Box, 
  Text, 
  Button, 
  Flex, 
  HStack, 
  Icon, 
  useColorModeValue, 
  useDisclosure, 
  VStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter
} from "@chakra-ui/react";
import { LockIcon, UnlockIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons';
import { motion } from "framer-motion";
import { Instance as InstanceInterface } from "../pages/Instances";
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useNotifications from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);
SyntaxHighlighter.registerLanguage('darcula', darcula);

const Instance = ({ instance, onRemove, refresh }: {instance: InstanceInterface, onRemove: (id: number) => any, refresh: () => void}) => {
  const { isOpen, onToggle } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = instance.status === 'unauthorized' ? 'red.300' : 'green.300';
  const iconColor = instance.status === 'unauthorized' ? 'red.500' : 'green.500';
  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = useRef(null);
  const showNotification = useNotifications();

  const navigate = useNavigate();
  const command = `# Add public key to authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "${instance.public_key}" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys`;

  const copyToClipboard = (type: string, text: string) => {
    navigator.clipboard.writeText(text);
    showNotification("Clipboard", `${type} was copied!`, "success");
  };

  return (
    <MotionBox
      p={4}
      bg={bgColor}
      w="100%"
      rounded="md"
      shadow="md"
      borderWidth={1}
      borderColor={borderColor}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onToggle}
      cursor="pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <HStack spacing={3}>
          <Icon as={instance.status === 'unauthorized' ? LockIcon : UnlockIcon} color={iconColor} />
          <Icon as={instance.status === 'unauthorized' ? CloseIcon : CheckIcon} color={iconColor} />
        </HStack>
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold">{instance.name}</Text>
          {isOpen && (
            <>
              <Text fontSize="sm" color="gray.500">UUID: {instance.uuid}</Text>
              <Text fontSize="sm" color="gray.500">Created at: {new Date(instance.created_at).toLocaleString()}</Text>
            </>
          )}
        </VStack>
        <Flex alignItems="center">
          {instance.status === 'unauthorized' && (
            <Button 
              colorScheme="yellow" 
              size="sm" 
              mr={2} 
              onClick={(e) => { 
                e.stopPropagation();
                onAlertOpen(); 
              }}
            >
              Resolve
            </Button>
          )}
          {instance.status === 'active' && (
            <Button 
              colorScheme="blue" 
              size="sm" 
              mr={2} 
              onClick={(e) => { 
                navigate(`/instances/${instance.uuid}`)
              }}
            >
              Open
            </Button>
          )}
          <Button 
            colorScheme="red" 
            size="sm" 
            onClick={(e) => { 
              e.stopPropagation();
              onRemove(instance.id); 
            }}
          >
            Remove
          </Button>
        </Flex>
      </Flex>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Resolve Unauthorized Access
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text mb={4}>
                To authorize this instance, you need to add the public key to the server. Please follow the instructions below:
              </Text>
              <Box mb={4}>
                <Flex alignItems="center" mb={2}>
                  <Text fontSize="sm" fontWeight="bold" flex="1">
                    Public Key
                  </Text>
                  <Button size="sm" onClick={() => copyToClipboard("Public key",instance.public_key)}>
                    Copy
                  </Button>
                </Flex>
                <SyntaxHighlighter language="bash" style={darcula}>
                  {instance.public_key}
                </SyntaxHighlighter>
              </Box>
              <Box>
                <Flex alignItems="center" mb={2}>
                  <Text fontSize="sm" fontWeight="bold" flex="1">
                    Ubuntu Commands
                  </Text>
                  <Button size="sm" onClick={() => copyToClipboard("Public key add file command",command)}>
                    Copy
                  </Button>
                </Flex>
                <SyntaxHighlighter language="bash" style={darcula}>
                  {command}
                </SyntaxHighlighter>
              </Box>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={onAlertClose} ml={3}>
                Done
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </MotionBox>
  );
};

export default Instance;