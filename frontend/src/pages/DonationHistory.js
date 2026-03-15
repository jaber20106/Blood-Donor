import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  useToast,
  Spinner,
  Center,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { donationService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await donationService.getMyDonations();
      setDonations(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching donations',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="red.500" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Sidebar />
      <Box ml={{ base: 0, md: '250px' }} pt="64px" p={6}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>My Donation History</Heading>
              <Text color="gray.600">View your blood donation records</Text>
            </Box>
            <Card>
              <CardBody>
                {donations.length === 0 ? (
                  <Text color="gray.500" textAlign="center" py={8}>No donations yet</Text>
                ) : (
                  <Table variant="simple">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Donation Date</Th>
                        <Th>Location</Th>
                        <Th>Status</Th>
                        <Th>Created At</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {donations.map((donation) => (
                        <Tr key={donation.id}>
                          <Td>{donation.donationDate ? new Date(donation.donationDate).toLocaleDateString() : 'N/A'}</Td>
                          <Td>{donation.location || 'N/A'}</Td>
                          <Td>{donation.status || 'COMPLETED'}</Td>
                          <Td>{new Date(donation.createdAt).toLocaleDateString()}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default DonationHistory;
