import React, { useState } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function LoginDebug() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log('Testing login with:', { email, password });
      console.log('API base URL:', import.meta.env.VITE_API_URL);
      
      const result = await authAPI.login({ email, password });
      console.log('Login response:', result);
      setResponse(result.data);
      toast.success('Login test successful!');
    } catch (err) {
      console.error('Login test error:', err);
      setError({
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
      });
      toast.error('Login test failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login Debug</h1>
      
      <div className="mb-4">
        <label className="block mb-2">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
      </div>

      <button
        onClick={handleTest}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Login'}
      </button>

      {response && (
        <div className="mt-4 p-4 bg-green-100 dark:bg-green-900 rounded">
          <h3 className="font-bold mb-2">Success Response:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded">
          <h3 className="font-bold mb-2">Error Details:</h3>
          <pre className="text-sm overflow-auto">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
