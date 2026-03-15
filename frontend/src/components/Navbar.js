import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role?.name === 'ADMIN' || user?.userType === 'ADMIN';
  const isClient = user?.role?.name === 'CLIENT' || user?.userType === 'CLIENT';

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Users', path: '/users' },
    { name: 'Donors', path: '/donors' },
    { name: 'Roles', path: '/roles' },
    { name: 'Statistics', path: '/statistics' },
    { name: 'Settings', path: '/admin-settings' },
  ];

  const donorLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
    { name: 'Donation History', path: '/donation-history' },
    { name: 'Donate Now', path: '/donate-now' },
    { name: 'Settings', path: '/profile' },
  ];

  const clientLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Search Donors', path: '/search-donors' },
    { name: 'Settings', path: '/profile' },
  ];

  const navLinks = isAdmin ? adminLinks : (isClient ? clientLinks : donorLinks);

  return (
    <>
      <Box bg="white" px={4} boxShadow="sm" position="fixed" w="100%" zIndex={10}>
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={4}>
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
              variant="outline"
              aria-label="Open menu"
              icon={<HamburgerIcon />}
            />
            <Text 
              fontSize="xl" 
              fontWeight="bold" 
              color="red.600" 
              cursor="pointer" 
              onClick={() => navigate('/dashboard')}
              whiteSpace="nowrap"
            >
              Blood Donation
            </Text>
          </HStack>
          
          <HStack 
            as="nav" 
            spacing={6} 
            display={{ base: 'none', md: 'flex' }}
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
          >
            {navLinks.map((link) => (
              <Text
                key={link.path}
                cursor="pointer"
                fontWeight={location.pathname === link.path ? 'bold' : 'medium'}
                color={location.pathname === link.path ? 'red.600' : 'gray.600'}
                onClick={() => navigate(link.path)}
                _hover={{ color: 'red.500' }}
                fontSize="sm"
              >
                {link.name}
              </Text>
            ))}
          </HStack>

          <HStack spacing={4}>
            <Text display={{ base: 'none', md: 'block' }} color="gray.600" fontSize="sm">
              {user?.name || user?.email || 'User'}
            </Text>
            <Button colorScheme="red" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>
        </Flex>
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <VStack pt={12} spacing={4} align="stretch">
            {navLinks.map((link) => (
              <Text
                key={link.path}
                cursor="pointer"
                p={2}
                fontWeight={location.pathname === link.path ? 'bold' : 'normal'}
                bg={location.pathname === link.path ? 'red.50' : 'transparent'}
                color={location.pathname === link.path ? 'red.600' : 'gray.600'}
                onClick={() => {
                  navigate(link.path);
                  onClose();
                }}
                _hover={{ bg: 'red.50', color: 'red.600' }}
              >
                {link.name}
              </Text>
            ))}
          </VStack>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
