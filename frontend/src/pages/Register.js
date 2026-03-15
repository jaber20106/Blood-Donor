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
  Select,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const BLOOD_GROUPS = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    userType: 'DONOR',
    bloodGroup: '',
    lastDonationDate: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      toast({
        title: 'Registration successful',
        description: 'Please login with your credentials',
        status: 'success',
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center" py={8}>
      <Container maxW="md">
        <Card>
          <CardBody>
            <VStack spacing={6}>
              <Heading size="lg" color="red.600">Blood Donation</Heading>
              <Text color="gray.600">Create an account</Text>
              <Box as="form" onSubmit={handleSubmit} w="100%">
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-type your password"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Register As</FormLabel>
                    <Select
                      name="userType"
                      value={formData.userType}
                      onChange={handleChange}
                    >
                      <option value="DONOR">Donor (I want to donate blood)</option>
                      <option value="CLIENT">Client (I need blood)</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Blood Group</FormLabel>
                    <Select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      placeholder="Select blood group"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{bg.replace('_', ' ')}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Last Donation Date</FormLabel>
                    <Input
                      name="lastDonationDate"
                      type="date"
                      value={formData.lastDonationDate}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    colorScheme="red"
                    w="100%"
                    isLoading={loading}
                  >
                    Register
                  </Button>
                </VStack>
              </Box>
              <Text>
                Already have an account?{' '}
                <Text as="span" color="red.500" cursor="pointer" onClick={() => navigate('/login')}>
                  Login
                </Text>
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default Register;
