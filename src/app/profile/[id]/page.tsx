'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { TextField, Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  firstName?: string;
  lastName?: string;
  nic?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  role?: 'patient' | 'counselor';
  profileImage?: string;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nic: '',
    address: '',
    city: '',
    postalCode: '',
    role: '' as 'patient' | 'counselor' | '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });

        if (response.data.user._id !== params.id) {
          router.push(`/profile/${response.data.user._id}`);
          return;
        }

        const user = response.data.user;
        setUserData(user);
        setFormData({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email,
          nic: user.nic || '',
          address: user.address || '',
          city: user.city || '',
          postalCode: user.postalCode || '',
          role: user.role || '',
        });
        setError(null);
      } catch (error: any) {
        console.error('Failed to fetch user data:', error);
        setError(error.response?.data?.error || error.message);
        if (error.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params.id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await axios.put('/api/users/update-profile', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      toast.success('Profile updated successfully!');
      setUserData({ ...userData, ...formData } as User);
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.error || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/api/users/logout');
      toast.success('Logout successful');
      router.push('/login');
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast.error(error.response?.data?.error || 'Logout failed');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">User not found</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center text-blue-500">Complete Your Profile</h1>
        {userData.profileImage && (
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            disabled
            fullWidth
            variant="outlined"
            InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
          />
          <TextField
            label="NIC"
            name="nic"
            value={formData.nic}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
          />
          <TextField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
          />
          <TextField
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
          />
          <FormControl fullWidth variant="outlined">
            <InputLabel style={{ fontFamily: 'Geist Sans, sans-serif' }}>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              label="Role"
              style={{ fontFamily: 'Geist Sans, sans-serif' }}
            >
              <MenuItem value="" disabled>
                Select Role
              </MenuItem>
              <MenuItem value="patient">Patient</MenuItem>
              <MenuItem value="counselor">Counselor</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            disabled={saving}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#3B82F6',
              color: 'white',
              borderRadius: '1.5rem',
              padding: '0.5rem 1rem',
              fontFamily: 'Geist Sans, sans-serif',
              '&:hover': { backgroundColor: '#2563EB' },
            }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
        <Button
          onClick={handleLogout}
          variant="outlined"
          fullWidth
          sx={{
            mt: 2,
            borderColor: '#3B82F6',
            color: '#3B82F6',
            borderRadius: '1.5rem',
            fontFamily: 'Geist Sans, sans-serif',
            '&:hover': { borderColor: '#2563EB', color: '#2563EB' },
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}