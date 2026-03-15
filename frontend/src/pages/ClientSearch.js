import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
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
  HStack,
  Badge,
  Grid,
} from '@chakra-ui/react';
import { clientService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const BLOOD_GROUPS = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'];

const ClientSearch = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    bloodGroup: '',
    district: '',
    upazila: '',
    area: '',
  });
  const toast = useToast();

  useEffect(() => {
    searchDonors();
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const searchDonors = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
      if (filters.district) params.district = filters.district;
      if (filters.upazila) params.upazila = filters.upazila;
      if (filters.area) params.area = filters.area;
      
      const response = await clientService.searchDonors(params);
      setDonors(response.data);
    } catch (error) {
      toast({
        title: 'Error searching donors',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchDonors();
  };

  const handleContact = async (donorId) => {
    try {
      await clientService.contactDonor(donorId);
      toast({
        title: 'Request sent',
        description: 'The donor has been notified',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to contact donor',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Sidebar />
      <Box ml={{ base: 0, md: '250px' }} pt="64px" p={6}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>Find Blood Donors</Heading>
              <Text color="gray.600">Search for eligible blood donors</Text>
            </Box>
            <Card>
              <CardBody>
                <Box as="form" onSubmit={handleSearch}>
                  <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr)' }} gap={4}>
                    <FormControl>
                      <FormLabel>Blood Group</FormLabel>
                      <Select name="bloodGroup" value={filters.bloodGroup} onChange={handleChange} placeholder="Any">
                        {BLOOD_GROUPS.map((bg) => (
                          <option key={bg} value={bg}>{bg.replace('_', ' ')}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl>
                      <FormLabel>District</FormLabel>
                      <Input name="district" value={filters.district} onChange={handleChange} placeholder="District" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Upazila</FormLabel>
                      <Input name="upazila" value={filters.upazila} onChange={handleChange} placeholder="Upazila" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Area</FormLabel>
                      <Input name="area" value={filters.area} onChange={handleChange} placeholder="Area" />
                    </FormControl>
                    <Box gridColumn="span 4">
                      <Button type="submit" colorScheme="red" isLoading={loading}>
                        Search
                      </Button>
                    </Box>
                  </Grid>
                </Box>
              </CardBody>
            </Card>

            {loading ? (
              <Center py={8}>
                <Spinner size="xl" color="red.500" />
              </Center>
            ) : (
              <Card>
                <CardBody>
                  {donors.length === 0 ? (
                    <Text color="gray.500" textAlign="center" py={8}>No donors found</Text>
                  ) : (
                    <Table variant="simple">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th>Blood Group</Th>
                          <Th>Mobile</Th>
                          <Th>Last Donation</Th>
                          <Th>District</Th>
                          <Th>Upazila</Th>
                          <Th>Area</Th>
                          <Th>Status</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {donors.map((donor) => (
                          <Tr key={donor.id}>
                            <Td>{donor.bloodGroup?.replace('_', ' ') || 'N/A'}</Td>
                            <Td>{donor.phone || donor.profile?.mobile || 'N/A'}</Td>
                            <Td>{donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}</Td>
                            <Td>{donor.profile?.district || 'N/A'}</Td>
                            <Td>{donor.profile?.upazila || 'N/A'}</Td>
                            <Td>{donor.profile?.area || 'N/A'}</Td>
                            <Td>
                              <Badge colorScheme={donor.profile?.availableStatus === 'AVAILABLE' ? 'green' : 'red'}>
                                {donor.profile?.availableStatus || 'UNKNOWN'}
                              </Badge>
                            </Td>
                            <Td>
                              <Button size="sm" colorScheme="red" onClick={() => handleContact(donor.id)}>
                                Contact
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </CardBody>
              </Card>
            )}
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default ClientSearch;
