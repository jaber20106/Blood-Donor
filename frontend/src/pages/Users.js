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
  Button,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  HStack,
  Badge,
  Grid,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { userService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const USER_TYPES = ['ADMIN', 'DONOR', 'CLIENT', 'SUDO_ADMIN'];
const BLOOD_GROUPS = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({
    phone: '',
    bloodGroup: '',
    userType: '',
    district: '',
    upazila: '',
    pageSize: 10,
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bloodGroup: '',
    userType: 'DONOR',
  });
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      const params = {};
      if (filters.phone) params.phone = filters.phone;
      if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
      if (filters.userType) params.userType = filters.userType;
      if (filters.district) params.district = filters.district;
      if (filters.upazila) params.upazila = filters.upazila;
      params.limit = filters.pageSize;
      
      const response = await userService.getUsers(params);
      setUsers(response.data.data || response.data);
    } catch (error) {
      toast({ title: 'Error fetching users', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      bloodGroup: '',
      userType: 'DONOR',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      password: '',
      confirmPassword: '',
      bloodGroup: user.bloodGroup || '',
      userType: user.userType || 'DONOR',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Passwords do not match', status: 'error', duration: 3000 });
      return;
    }
    try {
      await userService.createUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        bloodGroup: formData.bloodGroup,
        userType: formData.userType,
      });
      toast({ title: 'User created successfully', status: 'success', duration: 3000 });
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      toast({ title: 'Failed to create user', description: error.response?.data?.message, status: 'error', duration: 3000 });
    }
  };

  const handleUpdateUser = async () => {
    try {
      await userService.updateUser(editingUser.id, {
        name: formData.name,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        userType: formData.userType,
      });
      toast({ title: 'User updated successfully', status: 'success', duration: 3000 });
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      toast({ title: 'Update failed', description: error.response?.data?.message, status: 'error', duration: 3000 });
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Disable user ${user.email}?`)) {
      try {
        await userService.deleteUser(user.id);
        toast({ title: 'User disabled', status: 'success', duration: 2000 });
        fetchUsers();
      } catch (error) {
        toast({ title: 'Delete failed', status: 'error', duration: 3000 });
      }
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
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Heading size="lg" mb={2}>Users</Heading>
                <Text color="gray.600">Manage system users</Text>
              </Box>
              <Button leftIcon={<FiPlus />} colorScheme="red" onClick={handleOpenCreateModal}>
                Create User
              </Button>
            </Box>

            <Card>
              <CardBody>
                <Grid templateColumns={{ base: '1fr', md: 'repeat(6, 1fr)' }} gap={4} mb={4}>
                  <InputGroup>
                    <InputLeftElement><FiSearch /></InputLeftElement>
                    <Input name="phone" placeholder="Search by phone" value={filters.phone} onChange={handleFilterChange} />
                  </InputGroup>
                  <Select name="bloodGroup" placeholder="Blood Group" value={filters.bloodGroup} onChange={handleFilterChange}>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg.replace('_', ' ')}</option>
                    ))}
                  </Select>
                  <Select name="userType" placeholder="User Type" value={filters.userType} onChange={handleFilterChange}>
                    {USER_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Select>
                  <Input name="district" placeholder="District" value={filters.district} onChange={handleFilterChange} />
                  <Input name="upazila" placeholder="Upazila" value={filters.upazila} onChange={handleFilterChange} />
                  <Select name="pageSize" value={filters.pageSize} onChange={handleFilterChange}>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                  </Select>
                </Grid>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>ID</Th>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Blood Group</Th>
                      <Th>User Type</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => (
                      <Tr key={user.id}>
                        <Td>{user.id}</Td>
                        <Td>{user.name}</Td>
                        <Td>{user.email}</Td>
                        <Td>{user.phone}</Td>
                        <Td>{user.bloodGroup?.replace('_', ' ') || 'N/A'}</Td>
                        <Td>
                          <Badge colorScheme={user.userType === 'ADMIN' ? 'purple' : user.userType === 'DONOR' ? 'red' : 'blue'}>
                            {user.userType}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton icon={<FiEdit2 />} size="sm" variant="ghost" onClick={() => handleOpenEditModal(user)} aria-label="Edit" />
                            <IconButton icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" onClick={() => handleDelete(user)} aria-label="Disable" />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </VStack>
        </Container>
      </Box>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingUser ? 'Edit User' : 'Create New User'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input name="name" value={formData.name} onChange={handleFormChange} placeholder="Enter full name" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input name="email" type="email" value={formData.email} onChange={handleFormChange} placeholder="Enter email" isDisabled={!!editingUser} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input name="phone" value={formData.phone} onChange={handleFormChange} placeholder="Enter phone number" />
              </FormControl>
              {!editingUser && (
                <>
                  <FormControl isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input name="password" type="password" value={formData.password} onChange={handleFormChange} placeholder="Enter password" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleFormChange} placeholder="Re-type password" />
                  </FormControl>
                </>
              )}
              <FormControl>
                <FormLabel>Blood Group</FormLabel>
                <Select name="bloodGroup" value={formData.bloodGroup} onChange={handleFormChange} placeholder="Select blood group">
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{bg.replace('_', ' ')}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>User Type</FormLabel>
                <Select name="userType" value={formData.userType} onChange={handleFormChange}>
                  {USER_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </FormControl>
              <Button colorScheme="red" w="100%" onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                {editingUser ? 'Update User' : 'Create User'}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Users;
