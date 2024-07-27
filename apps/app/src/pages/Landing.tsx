import { Box, Button, Heading, Text, VStack, Divider, Stack, Flex, Container } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import animatedGlobe from '../assets/animated-globe.gif'
import animatedSearch from '../assets/animated-search.gif'
import animatedComputerDisplay from '../assets/animated-computer-display.gif'

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Header Section */}
      <Box bg="primary.100" color="white" py={6} px={8} shadow="md">
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">CI/CD Buddy</Heading>
          <Button colorScheme="teal" variant="outline" onClick={() => navigate('/signin')}>Sign In</Button>
        </Flex>
      </Box>

      {/* Main Hero Section */}
      <Box bg="primary.200" color="black" py={20} px={8}>
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
          <Heading as="h1" size="2xl">Complete CI/CD Solution</Heading>
            <Text fontSize="xl">From deployment to scaling, manage your applications with ease and efficiency.</Text>
            
            <Button colorScheme="teal" size="lg" onClick={() => navigate('/signin')}>Get Started</Button>
          </VStack>
        </Container>
      </Box>

      {/* Content Sections */}
      <Box py={20} px={8} bg="white">
        <Container maxW="container.xl">
          <VStack spacing={16}>

            {/* Deploy with Ease Section */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={8} alignItems="center">
            <img src={animatedGlobe} className="logo react" alt="React logo" />
              <VStack spacing={2} alignItems="flex-start">
                <Heading as="h2" size="lg" color="primary.100">Deploy with Ease</Heading>
                <Text fontSize="md" color="primary.500">Effortlessly deploy your applications with our seamless integration and intuitive interface.</Text>
              </VStack>
            </Stack>
            <Divider />

            {/* Monitor Efficiently Section */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={8} alignItems="center">
            <img src={animatedSearch} className="logo react" alt="React logo" />
              <VStack spacing={2} alignItems="flex-start">
                <Heading as="h2" size="lg" color="primary.100">Monitor Efficiently</Heading>
                <Text fontSize="md" color="primary.500">Keep an eye on your application's performance with real-time monitoring and analytics.</Text>
              </VStack>
            </Stack>
            <Divider />

            {/* Scale at Need Section */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={8} alignItems="center">
            <img src={animatedComputerDisplay} className="logo react" alt="React logo" width={200} height={200}/>
              <VStack spacing={2} alignItems="flex-start">
                <Heading as="h2" size="lg" color="primary.100">Scale at Need</Heading>
                <Text fontSize="md" color="primary.500">Easily scale your infrastructure to meet the demands of your growing application.</Text>
              </VStack>
            </Stack>
          </VStack>
        </Container>
      </Box>
      <a href="https://lordicon.com/">Icons by Lordicon.com</a>
    </Box>
  );
};

export default LandingPage;