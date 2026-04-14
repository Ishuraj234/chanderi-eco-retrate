import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-react';
import { authApi } from '../services/api';
import toast from 'react-hot-toast';

const UserRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
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
        
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authApi.register(formData);
            if (response.success) {
                toast.success('Registration successful!');
                navigate('/');
                setTimeout(() => window.location.reload(), 100);
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.message || 'Registration failed');
            toast.error('Could not create account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-green-100 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
                    <p className="text-gray-600 mt-2">Join us to book your eco retreat stay</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <div className="relative">
                            <input type="text" name="name" value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-green-500"
                                placeholder="John Doe" />
                            <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="relative">
                            <input type="email" name="email" value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-green-500"
                                placeholder="tourist@example.com" />
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input type="password" name="password" value={formData.password} onChange={handleChange}
                                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-green-500"
                                placeholder="••••••••" />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition flex justify-center">
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                    
                    <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-green-600 font-medium">Log In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default UserRegister;
