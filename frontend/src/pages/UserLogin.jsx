import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const UserLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authApi.userLogin(formData);
            if (response.success) {
                toast.success('Login successful!');
                navigate('/');
                setTimeout(() => window.location.reload(), 100);
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError(err.message || 'Login failed. Check details.');
            toast.error('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
                        <LogIn className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                    <p className="text-gray-600 mt-2">Welcome back to Chanderi Eco Retreat</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-blue-500"
                                placeholder="tourist@example.com" />
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input type="password" name="password" value={formData.password} onChange={handleChange}
                                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-blue-500"
                                placeholder="••••••••" />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition flex justify-center">
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                    
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account? <Link to="/register" className="text-blue-600 font-medium">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default UserLogin;
