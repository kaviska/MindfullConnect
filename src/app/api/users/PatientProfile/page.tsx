'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { TextField, Select, MenuItem, InputLabel, FormControl, Button, CircularProgress } from '@mui/material';

export default function PatientProfile() {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    nationality: '',
    nicPassport: '',
    applicationStatus: 'Pending' as 'Pending' | 'Approved' | 'Rejected',
    medicalQuestions: {
      soughtCounseling: '',
      onMedication: '',
      anxietyPanic: '',
      depressionHistory: '',
      suicidalThoughts: '',
      sleepDifficulties: '',
      diagnosedCondition: '',
      stressTrauma: '',
      supportSystem: '',
      openDiscussion: '',
    },
  });
  const [documents, setDocuments] = useState<{
    medicalDocuments: File | null;
  }>({
    medicalDocuments: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        const user = response.data.user;
        setFormData({
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          email: user.email,
          gender: user.gender || '',
          dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
          contactNumber: user.contactNumber || '',
          nationality: user.nationality || '',
          nicPassport: user.nic || '',
          applicationStatus: user.applicationStatus || 'Pending',
          medicalQuestions: {
            soughtCounseling: user.medicalQuestions?.soughtCounseling || '',
            onMedication: user.medicalQuestions?.onMedication || '',
            anxietyPanic: user.medicalQuestions?.anxietyPanic || '',
            depressionHistory: user.medicalQuestions?.depressionHistory || '',
            suicidalThoughts: user.medicalQuestions?.suicidalThoughts || '',
            sleepDifficulties: user.medicalQuestions?.sleepDifficulties || '',
            diagnosedCondition: user.medicalQuestions?.diagnosedCondition || '',
            stressTrauma: user.medicalQuestions?.stressTrauma || '',
            supportSystem: user.medicalQuestions?.supportSystem || '',
            openDiscussion: user.medicalQuestions?.openDiscussion || '',
          },
        });
        setProfilePic(user.profileImage || null);
        setLoading(false);
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        toast.error(error.response?.data?.error || 'Failed to load profile');
        if (error.response?.status === 401) {
          router.push('/login');
        }
      }
    };
    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('medicalQuestions.')) {
      const question = name.split('.')[1];
      setFormData({
        ...formData,
        medicalQuestions: { ...formData.medicalQuestions, [question]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDocuments({ ...documents, [type]: file });
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/api/users/upload-file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setProfilePic(response.data.filePath);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload profile picture');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('contactNumber', formData.contactNumber);
      formDataToSend.append('nationality', formData.nationality);
      formDataToSend.append('nicPassport', formData.nicPassport);
      Object.entries(formData.medicalQuestions).forEach(([key, value]) => {
        formDataToSend.append(`medicalQuestions[${key}]`, value);
      });
      if (profilePic) formDataToSend.append('profileImage', profilePic);
      if (documents.medicalDocuments) formDataToSend.append('medicalDocuments', documents.medicalDocuments);

      await axios.post('/api/users/update-role-profile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      toast.success('Patient profile updated successfully!');
      setIsEditing(false);
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.error || 'Profile update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-7xl">
        <form onSubmit={handleSave}>
          <div className="flex flex-col items-center mb-6 relative">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-500">Upload Photo</span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleProfilePicChange}
                disabled={!isEditing}
              />
            </div>
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <span
                className={`text-sm font-medium px-2 py-1 rounded-full ${
                  formData.applicationStatus === 'Pending'
                    ? 'bg-yellow-200 text-yellow-800'
                    : formData.applicationStatus === 'Approved'
                    ? 'bg-green-200 text-green-800'
                    : 'bg-red-200 text-red-800'
                }`}
              >
                {formData.applicationStatus}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">Patient Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={!isEditing}
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
              <FormControl fullWidth variant="outlined">
                <InputLabel style={{ fontFamily: 'Geist Sans, sans-serif' }}>Gender</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  label="Gender"
                  disabled={!isEditing}
                  style={{ fontFamily: 'Geist Sans, sans-serif' }}
                >
                  <MenuItem value="" disabled>
                    Select gender
                  </MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={!isEditing}
                InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={!isEditing}
                InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
              />
              <TextField
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={!isEditing}
                InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
              />
              <TextField
                label="NIC/Passport Number"
                name="nicPassport"
                value={formData.nicPassport}
                onChange={handleInputChange}
                fullWidth
                variant="outlined"
                disabled={!isEditing}
                InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
              />
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">Medical Questions</h2>
            <div className="space-y-4">
              {[
                { label: 'Have you sought counseling before?', name: 'soughtCounseling' },
                { label: 'Are you currently on medication for mental health?', name: 'onMedication' },
                { label: 'Have you experienced anxiety or panic attacks?', name: 'anxietyPanic' },
                { label: 'Do you have a history of depression?', name: 'depressionHistory' },
                { label: 'Have you had suicidal thoughts?', name: 'suicidalThoughts' },
                { label: 'Do you experience sleep difficulties?', name: 'sleepDifficulties' },
                { label: 'Have you been diagnosed with a mental health condition?', name: 'diagnosedCondition' },
                { label: 'Are you experiencing stress or trauma?', name: 'stressTrauma' },
                { label: 'Do you have a support system (e.g., family, friends)?', name: 'supportSystem' },
                { label: 'Are you willing to discuss your concerns openly?', name: 'openDiscussion' },
              ].map((question, index) => (
                <FormControl fullWidth variant="outlined" key={index}>
                  <InputLabel style={{ fontFamily: 'Geist Sans, sans-serif' }}>{question.label}</InputLabel>
                  <Select
                    name={`medicalQuestions.${question.name}`}
                    value={formData.medicalQuestions[question.name as keyof typeof formData.medicalQuestions]}
                    onChange={handleInputChange}
                    label={question.label}
                    disabled={!isEditing}
                    style={{ fontFamily: 'Geist Sans, sans-serif' }}
                  >
                    <MenuItem value="" disabled>
                      Select
                    </MenuItem>
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </Select>
                </FormControl>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-center mb-4 text-blue-800">Relevant Medical Documents</h2>
            <TextField
              label="Upload Medical Documents"
              type="file"
              inputProps={{ accept: '.pdf' }}
              onChange={(e: any) => handleFileChange(e, 'medicalDocuments')}
              fullWidth
              variant="outlined"
              disabled={!isEditing}
              InputLabelProps={{ shrink: true }}
              InputProps={{ style: { fontFamily: 'Geist Sans, sans-serif' } }}
            />
            {formData.medicalDocuments && (
              <div className="mt-2 flex items-center">
                <a href={formData.medicalDocuments} target="_blank" className="text-blue-600">View Medical Documents</a>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6 space-x-4">
            {isEditing ? (
              <Button
                type="submit"
                disabled={saving}
                variant="contained"
                sx={{
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  borderRadius: '1.5rem',
                  padding: '0.5rem 1rem',
                  fontFamily: 'Geist Sans, sans-serif',
                  '&:hover': { backgroundColor: '#2563EB' },
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="contained"
                sx={{
                  backgroundColor: '#6B7280',
                  color: 'white',
                  borderRadius: '1.5rem',
                  padding: '0.5rem 1rem',
                  fontFamily: 'Geist Sans, sans-serif',
                  '&:hover': { backgroundColor: '#4B5563' },
                }}
              >
                Edit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}