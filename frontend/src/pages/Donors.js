import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Button,
  useDisclosure,
  Input,
} from '@chakra-ui/react';
import { donorService } from '../services/api';
import DataTable from '../components/DataTable';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDonor, setEditingDonor] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const response = await donorService.getEligibleDonors();
      setDonors(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching donors',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (donor) => {
    setEditingDonor(donor);
    onOpen();
  };

  const handleUpdate = async () => {
    try {
      await donorService.updateEligibility(editingDonor.id, {
        isEligible: editingDonor.isEligible,
      });
      toast({ title: 'Donor updated', status: 'success', duration: 2000 });
      fetchDonors();
      onClose();
    } catch (error) {
      toast({ title: 'Update failed', status: 'error', duration: 3000 });
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'fullName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Blood Type', accessor: 'bloodType' },
    { header: 'Date of Birth', accessor: 'dateOfBirth' },
    { header: 'Eligible', accessor: 'isEligible', render: (item) => item.isEligible ? 'Yes' : 'No' },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Sidebar />
      <Box ml={{ base: 0, md: '250px' }} pt="64px" p={6}>
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>Donors</Heading>
              <Text color="gray.600">Manage blood donors</Text>
            </Box>
            <DataTable
              data={donors}
              columns={columns}
              onEdit={handleEdit}
              loading={loading}
              emptyMessage="No donors found"
            />
          </VStack>
        </Container>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Donor Eligibility</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={editingDonor?.fullName || ''} isReadOnly />
              </FormControl>
              <FormControl>
                <FormLabel>Eligibility Status</FormLabel>
                <Select
                  value={editingDonor?.isEligible ? 'true' : 'false'}
                  onChange={(e) => setEditingDonor({ ...editingDonor, isEligible: e.target.value === 'true' })}
                >
                  <option value="true">Eligible</option>
                  <option value="false">Not Eligible</option>
                </Select>
              </FormControl>
              <Button colorScheme="red" w="100%" onClick={handleUpdate}>
                Update
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Donors;
