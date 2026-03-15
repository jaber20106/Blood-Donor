import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  Container,
  VStack,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { statisticsService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const COLORS = ['#e53e3e', '#3182ce', '#38a169', '#d69e2e', '#805ad5', '#dd6b20', '#319795', '#718096'];

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statisticsService.getPublicStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
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
              <Heading size="lg" mb={2}>Statistics</Heading>
              <Text color="gray.600">Blood donation statistics and analytics</Text>
            </Box>
            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                <Heading size="md" mb={4}>Blood Type Distribution</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.bloodTypeStats || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="bloodType" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#e53e3e" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
                <Heading size="md" mb={4}>Blood Type Pie Chart</Heading>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats?.bloodTypeStats || []}
                      dataKey="count"
                      nameKey="bloodType"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {(stats?.bloodTypeStats || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" textAlign="center">
                <Text fontSize="4xl" fontWeight="bold" color="red.600">
                  {stats?.totalDonors || 0}
                </Text>
                <Text color="gray.600">Total Donors</Text>
              </Box>
              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" textAlign="center">
                <Text fontSize="4xl" fontWeight="bold" color="green.600">
                  {stats?.eligibleDonors || 0}
                </Text>
                <Text color="gray.600">Eligible Donors</Text>
              </Box>
              <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" textAlign="center">
                <Text fontSize="4xl" fontWeight="bold" color="blue.600">
                  {stats?.totalDonations || 0}
                </Text>
                <Text color="gray.600">Total Donations</Text>
              </Box>
            </Grid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Statistics;
