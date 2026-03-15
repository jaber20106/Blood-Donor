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
import { useNavigate } from 'react-router-dom';
import { userService, donorService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const BLOOD_GROUPS = ['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'];
const GENDERS = ['MALE', 'FEMALE', 'OTHER'];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodGroup: '',
    gender: '',
    lastDonationDate: '',
    district: '',
    upazila: '',
    area: '',
    additionalInfo: '',
    facebook: '',
    linkedin: '',
    twitter: '',
    website: '',
  });
  const { user } = useAuth();
  const navigate = useNavigate();
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
      toast({
        title: 'Error fetching profile',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        district: formData.district,
        upazila: formData.upazila,
        area: formData.area,
        additionalInfo: formData.additionalInfo,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
        twitter: formData.twitter,
        website: formData.website,
      });
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
      });
      fetchProfile();
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
      });
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
              <Heading size="lg" mb={2}>My Profile</Heading>
              <Text color="gray.600">Manage your profile information</Text>
            </Box>
            <Card>
              <CardBody>
                <Box as="form" onSubmit={handleSubmit}>
                  <VStack spacing={6} align="stretch">
                    <Box>
                      <Heading size="md" mb={4}>Basic Information</Heading>
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
                            <FormLabel>Last Donation Date</FormLabel>
                            <Input name="lastDonationDate" type="date" value={formData.lastDonationDate} onChange={handleChange} />
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

export default Profile;
