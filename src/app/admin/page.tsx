import React from 'react';

const Admin = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Welcome to the Blog</h1>
                <p className="text-gray-700 mb-4">
                    This is a sample blog page created for testing purposes. You can add your content here.
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Read More
                </button>
            </div>
        </div>
    );
};

export default Admin;