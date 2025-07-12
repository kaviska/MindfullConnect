'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  name?: string;
  phone?: string;
  profileImage?: string;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/users/profile', {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        if (response.data.user._id !== params.id) {
          router.push(`/profile/${response.data.user._id}`);
          return;
        }
        
        setUserData(response.data.user);
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
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
        {userData.profileImage && (
          <img
            src={userData.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        <h1 className="text-xl font-semibold">{userData.name || userData.username}</h1>
        <p className="text-gray-600 mt-2">
          <strong>Email:</strong> {userData.email}
        </p>
        {userData.phone && (
          <p className="text-gray-600">
            <strong>Phone:</strong> {userData.phone}
          </p>
        )}

        <button
          onClick={ () => {
            
            
            // Add logout functionality here
            router.push('/login');
          }}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-3xl shadow-sm hover:bg-blue-700 mt-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}