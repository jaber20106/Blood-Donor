import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Container,
  VStack,
  HStack,
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
  Grid,
  GridItem,
  Divider,
} from '@chakra-ui/react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const BLOOD_GROUPS = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'];
const GENDERS = ['MALE', 'FEMALE', 'OTHER'];
const USER_TYPES = ['ADMIN', 'DONOR', 'CLIENT', 'SUDO_ADMIN'];

const AdminSettings = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodGroup: '',
    gender: '',
    lastDonationDate: '',
    userType: '',
    isActive: true,
    district: '',
    upazila: '',
    area: '',
    additionalInfo: '',
    facebook: '',
    linkedin: '',
    twitter: '',
    website: '',
  });
  const { user: authUser } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
      const data = response.data;
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        bloodGroup: data.bloodGroup || '',
        gender: data.gender || '',
        lastDonationDate: data.lastDonationDate ? data.lastDonationDate.split('T')[0] : '',
        userType: data.userType || '',
        isActive: data.isActive ?? true,
        district: data.profile?.district || '',
        upazila: data.profile?.upazila || '',
        area: data.profile?.area || '',
        additionalInfo: data.profile?.additionalInfo || '',
        facebook: data.profile?.facebook || '',
        linkedin: data.profile?.linkedin || '',
        twitter: data.profile?.twitter || '',
        website: data.profile?.website || '',
      });
    } catch (error) {
      toast({ title: 'Error fetching profile', status: 'error', duration: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        gender: formData.gender,
        lastDonationDate: formData.lastDonationDate || null,
        userType: formData.userType,
        isActive: formData.isActive,
        district: formData.district,
        upazila: formData.upazila,
        area: formData.area,
        additionalInfo: formData.additionalInfo,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        website: formData.website,
      });
      toast({ title: 'Settings updated successfully', status: 'success', duration: 3000 });
      fetchProfile();
    } catch (error) {
      toast({ title: 'Update failed', description: error.response?.data?.message, status: 'error', duration: 3000 });
    } finally {
      setSaving(false);
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
              <Heading size="lg" mb={2}>Admin Settings</Heading>
              <Text color="gray.600">Manage your profile and settings</Text>
            </Box>
            <Card>
              <CardBody>
                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="md" mb={4}>Profile Information</Heading>
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Email</FormLabel>
                            <Input value={profile?.email || ''} isReadOnly />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Phone</FormLabel>
                            <Input name="phone" value={formData.phone} onChange={handleChange} />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Blood Group</FormLabel>
                            <Select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="Select blood group">
                              {BLOOD_GROUPS.map((bg) => (
                                <option key={bg} value={bg}>{bg.replace('_', ' ')}</option>
                              ))}
                            </Select>
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Gender</FormLabel>
                            <Select name="gender" value={formData.gender} onChange={handleChange} placeholder="Select gender">
                              {GENDERS.map((g) => (
                                <option key={g} value={g}>{g}</option>
                              ))}
                            </Select>
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>User Type</FormLabel>
                            <Select name="userType" value={formData.userType} onChange={handleChange}>
                              {USER_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </Select>
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Last Donation Date</FormLabel>
                            <Input name="lastDonationDate" type="date" value={formData.lastDonationDate} onChange={handleChange} />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl display="flex" alignItems="center" h="100%">
                            <FormLabel mb={0}>Active Status</FormLabel>
                            <Input
                              as="select"
                              name="isActive"
                              value={formData.isActive ? 'true' : 'false'}
                              onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                              w="auto"
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </Input>
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="md" mb={4}>Location Information</Heading>
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>District</FormLabel>
                            <Input name="district" value={formData.district} onChange={handleChange} />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Upazila</FormLabel>
                            <Input name="upazila" value={formData.upazila} onChange={handleChange} />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Area</FormLabel>
                            <Input name="area" value={formData.area} onChange={handleChange} />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="md" mb={4}>Additional Information</Heading>
                      <FormControl>
                        <FormLabel>Additional Info</FormLabel>
                        <Input name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} />
                      </FormControl>
                    </Box>

                    <Divider />

                    <Box>
                      <Heading size="md" mb={4}>Social Profiles</Heading>
                      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Facebook</FormLabel>
                            <Input name="facebook" value={formData.facebook} onChange={handleChange} placeholder="Facebook URL" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>LinkedIn</FormLabel>
                            <Input name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn URL" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Twitter</FormLabel>
                            <Input name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter URL" />
                          </FormControl>
                        </GridItem>
                        <GridItem>
                          <FormControl>
                            <FormLabel>Website</FormLabel>
                            <Input name="website" value={formData.website} onChange={handleChange} placeholder="Website URL" />
                          </FormControl>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Button type="submit" colorScheme="red" isLoading={saving}>
                      Save Changes
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

export default AdminSettings;
