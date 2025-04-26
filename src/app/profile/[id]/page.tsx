'use client';

import React from 'react';

export default function UserProfile({params}:any) {
  const client = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profileImage: '/profile.jpg',
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm text-center">
        <img
          src={client.profileImage}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
        />
        <h1 className="text-xl font-semibold">{client.name}</h1>
        <p className="text-gray-600 mt-2">
          <strong>Email:</strong> {client.email}
        </p>
        <p className="text-gray-600">
          <strong>Phone:</strong> {client.phone}
        </p>
        <p className="text-gray-600">
          <strong>id:</strong> {params.id}
        </p>
      </div>
    </div>
  );
}
