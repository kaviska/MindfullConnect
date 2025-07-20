'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const AdminProfile = () => {
  const router = useRouter();

  const fields = [
    { label: 'First Name', value: 'Kasun' },
    { label: 'Last Name', value: 'Maduranga' },
    { label: 'Email', value: 'udaramadushan23@gmail.com' },
    { label: 'NIC', value: '2002344589V' },
    { label: 'Address', value: '123 Temple Road' },
    { label: 'Contact No', value: 'Kandaan' }
  ];

  return (
    <div className="min-h-screen flex flex-col w-full items-center p-6 md:p-10">
      {/* Tabs */}
      <div className="flex border-b w-full max-w-6xl mb-8">
        <button className="px-4 py-2 font-semibold text-blue-600 border-b-2 border-blue-600">
          Profile
        </button>
        <button
          onClick={() => router.push('/admind/adminprofile/password')}
          className="px-4 py-2 ml-4 text-gray-500 hover:text-blue-600"
        >
          Change Password
        </button>
      </div>

      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <Image
          src="/rsessions.png"
          alt="Profile Picture"
          width={120}
          height={120}
          className="rounded-full object-cover"
        />
      </div>

      {/* Fields */}
      <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map(({ label, value }, idx) => (
          <div key={idx} className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1">{label}</label>
            <input
              type="text"
              value={value}
              disabled
              className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-[#94A3B8] focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Edit Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => router.push('/admind/adminprofile/editprofile')}
          className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm hover:bg-blue-700 transition"
        >
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;