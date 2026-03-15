import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  Container,
  VStack,
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
  Button,
} from '@chakra-ui/react';
import { FiUsers, FiHeart, FiActivity, FiCalendar, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { statisticsService, donationService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const StatCard = ({ icon, label, value, color, onClick }) => (
  <Card cursor={onClick ? 'pointer' : 'default'} onClick={onClick} _hover={onClick ? { shadow: 'md' } : {}}>
    <CardBody>
      <Stat>
        <StatLabel color="gray.500">{label}</StatLabel>
        <StatNumber fontSize="2xl" color={color}>{value || 0}</StatNumber>
      </Stat>
    </CardBody>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role?.name === 'ADMIN' || user?.userType === 'ADMIN';
  const isClient = user?.role?.name === 'CLIENT' || user?.userType === 'CLIENT';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await statisticsService.getPublicStats();
      setStats(statsRes.data);
      
      if (!isAdmin) {
        const donationsRes = await donationService.getMyDonations();
        setDonations(donationsRes.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
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

  if (isAdmin) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar />
        <Sidebar />
        <Box ml={{ base: 0, md: '250px' }} pt="64px" p={6}>
          <Container maxW="container.xl">
            <VStack spacing={6} align="stretch">
              <Box>
                <Heading size="lg" mb={2}>Dashboard</Heading>
                <Text color="gray.600">Welcome to Blood Donation Management System</Text>
              </Box>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                <StatCard
                  icon={FiUsers}
                  label="Total Users"
                  value={stats?.totalUsers || 0}
                  color="blue.500"
                  onClick={() => navigate('/users')}
                />
                <StatCard
                  icon={FiHeart}
                  label="Total Donors"
                  value={stats?.totalDonors || 0}
                  color="red.500"
                  onClick={() => navigate('/donors')}
                />
                <StatCard
                  icon={FiActivity}
                  label="Eligible Donors"
                  value={stats?.eligibleDonors || 0}
                  color="green.500"
                />
                <StatCard
                  icon={FiCalendar}
                  label="Total Donations"
                  value={stats?.totalDonations || 0}
                  color="purple.500"
                />
              </Grid>
              <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
                <Card>
                  <CardBody>
                    <Heading size="md" mb={4}>Blood Type Distribution</Heading>
                    <VStack align="stretch" spacing={2}>
                      {stats?.bloodTypeStats?.map((item, index) => (
                        <Box key={index} display="flex" justifyContent="space-between" p={2} bg="gray.50" borderRadius="md">
                          <Text fontWeight="medium">{item.bloodType}</Text>
                          <Text color="red.600" fontWeight="bold">{item.count}</Text>
                        </Box>
                      )) || <Text color="gray.500">No data available</Text>}
                    </VStack>
                  </CardBody>
                </Card>
                <Card>
                  <CardBody>
                    <Heading size="md" mb={4}>Quick Actions</Heading>
                    <VStack spacing={3} align="stretch">
                      <Button colorScheme="red" onClick={() => navigate('/users')}>Manage Users</Button>
                      <Button colorScheme="red" variant="outline" onClick={() => navigate('/donors')}>View Donors</Button>
                      <Button colorScheme="red" variant="outline" onClick={() => navigate('/statistics')}>View Statistics</Button>
                    </VStack>
                  </CardBody>
                </Card>
              </Grid>
            </VStack>
          </Container>
        </Box>
      </Box>
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
              <Heading size="lg" mb={2}>Welcome, {user?.name || 'Donor'}!</Heading>
              <Text color="gray.600">Blood Donation Management</Text>
            </Box>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              <StatCard
                label="Total Donations"
                value={donations.length}
                color="red.500"
                onClick={() => navigate('/donation-history')}
              />
              <StatCard
                label="Blood Group"
                value={user?.bloodGroup?.replace('_', ' ') || 'Not Set'}
                color="blue.500"
                onClick={() => navigate('/profile')}
              />
              <StatCard
                label="Profile Status"
                value={user?.isProfileComplete ? 'Complete' : 'Incomplete'}
                color={user?.isProfileComplete ? 'green.500' : 'orange.500'}
                onClick={() => navigate('/profile')}
              />
            </Grid>
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Recent Donations</Heading>
                  {donations.length === 0 ? (
                    <Text color="gray.500">No donations yet</Text>
                  ) : (
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Date</Th>
                          <Th>Location</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {donations.map((d) => (
                          <Tr key={d.id}>
                            <Td>{d.donationDate ? new Date(d.donationDate).toLocaleDateString() : 'N/A'}</Td>
                            <Td>{d.location || 'N/A'}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                  <Button mt={4} size="sm" colorScheme="red" variant="outline" onClick={() => navigate('/donation-history')}>
                    View All
                  </Button>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Quick Actions</Heading>
                  <VStack spacing={3} align="stretch">
                    <Button colorScheme="red" onClick={() => navigate('/donate-now')}>Donate Now</Button>
                    <Button colorScheme="red" variant="outline" onClick={() => navigate('/profile')}>Update Profile</Button>
                    {isClient && (
                      <Button colorScheme="red" variant="outline" onClick={() => navigate('/search-donors')}>
                        Search Donors
                      </Button>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            </Grid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
