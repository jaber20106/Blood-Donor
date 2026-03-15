import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Heading,
  Container,
  useToast,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('admin@blood-donation.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const { accessToken, user } = response.data;
      login(accessToken, user);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <Container maxW="md">
        <Card>
          <CardBody>
            <VStack spacing={6}>
              <Heading size="lg" color="red.600">Blood Donation</Heading>
              <Text color="gray.600">Login to your account</Text>
              <Box as="form" onSubmit={handleSubmit} w="100%">
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="red"
                    w="100%"
                    isLoading={loading}
                  >
                    Login
                  </Button>
                </VStack>
              </Box>
              <Text>
                Don't have an account?{' '}
                <Text as="span" color="red.500" cursor="pointer" onClick={() => navigate('/register')}>
                  Register
                </Text>
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;
