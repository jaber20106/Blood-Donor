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
  Checkbox,
  CheckboxGroup,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { roleService, permissionService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissionIds: [],
  });
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, permsRes] = await Promise.all([
        roleService.getRoles(),
        permissionService.getPermissions(),
      ]);
      setRoles(rolesRes.data);
      setPermissions(permsRes.data);
    } catch (error) {
      toast({ title: 'Error fetching data', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role = null) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description || '',
        permissionIds: role.permissions?.map((p) => p.id) || [],
      });
    } else {
      setEditingRole(null);
      setFormData({ name: '', description: '', permissionIds: [] });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handlePermissionChange = (permissionIds) => {
    setFormData({ ...formData, permissionIds });
  };

  const handleSubmit = async () => {
    try {
      const data = {
        description: formData.description,
        permissionIds: formData.permissionIds,
      };
      if (editingRole) {
        await roleService.updateRole(editingRole.id, data);
        toast({ title: 'Role updated', status: 'success', duration: 2000 });
      } else {
        await roleService.createRole({
          name: formData.name,
          description: formData.description,
          permissionIds: formData.permissionIds,
        });
        toast({ title: 'Role created', status: 'success', duration: 2000 });
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      toast({ title: 'Operation failed', description: error.response?.data?.message, status: 'error', duration: 3000 });
    }
  };

  const handleDelete = async (role) => {
    if (window.confirm(`Delete role ${role.name}?`)) {
      try {
        await roleService.deleteRole(role.id);
        toast({ title: 'Role deleted', status: 'success', duration: 2000 });
        fetchData();
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
      <Box ml={{ base: 0, md: '250px' }} pt="64px" p={6} position="relative" zIndex={1} overflow="visible">
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Heading size="lg" mb={2}>Role Management</Heading>
                <Text color="gray.600">Manage roles and permissions</Text>
              </Box>
              <Button leftIcon={<FiPlus />} colorScheme="red" onClick={() => handleOpenModal()}>
                Create Role
              </Button>
            </Box>
            <Card>
              <CardBody>
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>ID</Th>
                      <Th>Name</Th>
                      <Th>Description</Th>
                      <Th>Permissions</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {roles.map((role) => (
                      <Tr key={role.id}>
                        <Td>{role.id}</Td>
                        <Td fontWeight="bold">{role.name}</Td>
                        <Td>{role.description || 'N/A'}</Td>
                        <Td>
                          <Wrap>
                            {role.permissions?.slice(0, 3).map((p) => (
                              <WrapItem key={p.id}>
                                <Badge colorScheme="blue" fontSize="xs">{p.name}</Badge>
                              </WrapItem>
                            ))}
                            {role.permissions?.length > 3 && (
                              <WrapItem>
                                <Badge colorScheme="gray" fontSize="xs">+{role.permissions.length - 3}</Badge>
                              </WrapItem>
                            )}
                          </Wrap>
                        </Td>
                        <Td>
                          <Badge colorScheme={role.isActive ? 'green' : 'red'}>
                            {role.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton icon={<FiEdit2 />} size="sm" variant="ghost" onClick={() => handleOpenModal(role)} aria-label="Edit" />
                            <IconButton icon={<FiTrash2 />} size="sm" variant="ghost" colorScheme="red" onClick={() => handleDelete(role)} aria-label="Delete" />
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

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="4xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingRole ? 'Edit Role' : 'Create Role'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Role Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter role name"
                  isDisabled={!!editingRole}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Permissions</FormLabel>
                <Box border="1px" borderColor="gray.200" borderRadius="md" p={3} maxH="200px" overflowY="auto">
                  <CheckboxGroup value={formData.permissionIds} onChange={handlePermissionChange}>
                    <Wrap spacing={2}>
                      {permissions.map((perm) => (
                        <WrapItem key={perm.id}>
                          <Checkbox value={perm.id}>{perm.name}</Checkbox>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </CheckboxGroup>
                </Box>
              </FormControl>
              <Button colorScheme="red" w="100%" onClick={handleSubmit}>
                {editingRole ? 'Update' : 'Create'}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Roles;
