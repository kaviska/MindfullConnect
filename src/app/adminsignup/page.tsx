'use client';

import { useState } from 'react';

interface User {
  email: string;
  password: string;
}

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<User>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const endpoint = isLogin ? '/api/login' : '/api/signup';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(data.message);
      if (isLogin) {
        // Simulate login success (e.g., redirect or set token)
        console.log('Logged in:', data);
      } else {
        setUser({ email: '', password: '' });
      }
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Admin Login' : 'Admin Signup'}</h2>
      <div className="mb-4">
        <button
          onClick={() => { setIsLogin(true); setError(null); setMessage(null); }}
          className={`mr-2 p-2 ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Login
        </button>
        <button
          onClick={() => { setIsLogin(false); setError(null); setMessage(null); }}
          className={`p-2 ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Signup
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          {isLogin ? 'Login' : 'Signup'}
        </button>
      </form>
    </div>
  );
}