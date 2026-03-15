import React from 'react';
import {
  Box,
  VStack,
  Text,
  Icon,
  Flex,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiUsers, FiHeart, FiBarChart2, FiUser, FiClock, FiPlusCircle, FiSearch, FiSettings, FiShield } from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = user?.role?.name === 'ADMIN' || user?.userType === 'ADMIN';
  const isClient = user?.role?.name === 'CLIENT' || user?.userType === 'CLIENT';

  const adminMenuItems = [
    { name: 'Dashboard', icon: FiGrid, path: '/dashboard' },
    { name: 'Users', icon: FiUsers, path: '/users' },
    { name: 'Donors', icon: FiHeart, path: '/donors' },
    { name: 'Roles', icon: FiShield, path: '/roles' },
    { name: 'Statistics', icon: FiBarChart2, path: '/statistics' },
    { name: 'Settings', icon: FiSettings, path: '/admin-settings' },
  ];

  const donorMenuItems = [
    { name: 'Dashboard', icon: FiGrid, path: '/dashboard' },
    { name: 'My Profile', icon: FiUser, path: '/profile' },
    { name: 'Donation History', icon: FiClock, path: '/donation-history' },
    { name: 'Donate Now', icon: FiPlusCircle, path: '/donate-now' },
  ];

  const clientMenuItems = [
    { name: 'Dashboard', icon: FiGrid, path: '/dashboard' },
    { name: 'Search Donors', icon: FiSearch, path: '/search-donors' },
  ];

  const menuItems = isAdmin ? adminMenuItems : (isClient ? clientMenuItems : donorMenuItems);

  return (
    <Box
      display={{ base: 'none', md: 'block' }}
      w="250px"
      h="calc(100vh - 64px)"
      bg="white"
      position="fixed"
      left={0}
      top="64px"
      boxShadow="sm"
      py={4}
    >
      <VStack spacing={2} align="stretch" px={4}>
        {menuItems.map((item) => (
          <Flex
            key={item.path}
            align="center"
            p={3}
            cursor="pointer"
            borderRadius="md"
            bg={location.pathname === item.path ? 'red.50' : 'transparent'}
            color={location.pathname === item.path ? 'red.600' : 'gray.600'}
            onClick={() => navigate(item.path)}
            _hover={{
              bg: 'red.50',
              color: 'red.600',
            }}
            transition="all 0.2s"
          >
            <Icon as={item.icon} mr={3} boxSize={5} />
            <Text fontWeight={location.pathname === item.path ? 'semibold' : 'medium'}>
              {item.name}
            </Text>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
