import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Card,
  CardBody,
  Grid,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DonateNow = () => {
  const [formData, setFormData] = useState({
    phone: '',
    donationDate: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await donationService.createDonation({
        phone: formData.phone,
        donationDate: formData.donationDate,
        location: formData.location,
      });
      toast({
        title: 'Donation recorded successfully',
        status: 'success',
        duration: 3000,
      });
      navigate('/donation-history');
    } catch (error) {
      toast({
        title: 'Failed to record donation',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Sidebar />
      <Box ml={{ base: 0, md: '250px' }} pt="64px" p={6}>
        <Container maxW="container.md">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>Record Blood Donation</Heading>
              <Text color="gray.600">Enter your donation details</Text>
            </Box>
            <Card>
              <CardBody>
                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Donation Date</FormLabel>
                      <Input
                        name="donationDate"
                        type="date"
                        value={formData.donationDate}
                        onChange={handleChange}
                      />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Location</FormLabel>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter donation location"
                      />
                    </FormControl>
                    <Button type="submit" colorScheme="red" w="100%" isLoading={loading}>
                      Submit Donation
                    </Button>
                  </VStack>
                </Box>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default DonateNow;
