
import React, { useState } from 'react';
import { Admin } from '../types';

interface CreateAdminFormProps {
  onCreateAdmin: (newAdmin: Admin) => void;
}

const CreateAdminForm: React.FC<CreateAdminFormProps> = ({ onCreateAdmin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!userId || !password || !name || !email || !mobile) {
      setError('All fields are required.');
      return;
    }
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    // Basic mobile validation (e.g., 10 digits)
    if (!/^\d{10}$/.test(mobile)) {
        setError('Mobile number must be 10 digits.');
        return;
    }

    try {
      onCreateAdmin({
        userId,
        password_do_not_store_plaintext_in_real_apps: password, // Important: In a real app, hash the password on the backend.
        name,
        email,
        mobile,
      });
      setSuccessMessage(`Admin ${name} (${userId}) created successfully!`);
      // Clear form
      setUserId('');
      setPassword('');
      setName('');
      setEmail('');
      setMobile('');
    } catch (err: any) {
      setError(err.message || 'Failed to create admin.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h4 className="text-lg font-medium text-slate-100 mb-3">Create New Admin User</h4>
      {error && <div className="p-3 bg-red-700 border border-red-900 text-red-100 rounded-md text-sm">{error}</div>}
      {successMessage && <div className="p-3 bg-green-700 border border-green-900 text-green-100 rounded-md text-sm">{successMessage}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="adminUserId" className="block text-sm font-medium text-slate-300">User ID</label>
          <input type="text" id="adminUserId" value={userId} onChange={(e) => setUserId(e.target.value)} required 
          className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"/>
        </div>
        <div>
          <label htmlFor="adminPassword" className="block text-sm font-medium text-slate-300">Password</label>
          <input type="password" id="adminPassword" value={password} onChange={(e) => setPassword(e.target.value)} required 
          className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"/>
        </div>
        <div>
          <label htmlFor="adminName" className="block text-sm font-medium text-slate-300">Full Name</label>
          <input type="text" id="adminName" value={name} onChange={(e) => setName(e.target.value)} required 
          className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"/>
        </div>
        <div>
          <label htmlFor="adminEmail" className="block text-sm font-medium text-slate-300">Email ID</label>
          <input type="email" id="adminEmail" value={email} onChange={(e) => setEmail(e.target.value)} required 
          className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"/>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="adminMobile" className="block text-sm font-medium text-slate-300">Mobile Number</label>
          <input type="tel" id="adminMobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required 
          className="mt-1 block w-full px-3 py-2 bg-slate-500 border border-slate-400 rounded-md shadow-sm placeholder-slate-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm text-slate-100"/>
        </div>
      </div>
      <button type="submit" 
        className="w-full md:w-auto mt-2 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-600 focus:ring-emerald-500 transition-colors">
        Create Admin
      </button>
    </form>
  );
};

export default CreateAdminForm;
