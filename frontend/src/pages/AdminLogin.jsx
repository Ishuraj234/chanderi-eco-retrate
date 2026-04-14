import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
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
            console.log('📤 Sending login request:', formData.email);
            
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email: formData.email,
                password: formData.password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📥 Login response:', response.data);
            
            if (response.data.success) {
                // Save token to localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                console.log('✅ Login successful, redirecting to admin panel...');
                
                // Redirect to admin panel
                navigate('/admin');
                // Reload to refresh auth state
                setTimeout(() => window.location.reload(), 100);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (err) {
            console.error('❌ Login error:', err);
            
            if (err.response) {
                // Server responded with error
                console.error('Server response:', err.response.data);
                setError(err.response.data?.message || 'Login failed. Check your credentials.');
            } else if (err.request) {
                // Request was made but no response
                console.error('No response from server');
                setError('Cannot connect to server. Make sure backend is running on port 5000.');
            } else {
                // Something else happened
                setError(err.message || 'Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-primary-100 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-primary-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
                    <p className="text-gray-600 mt-2">Access the admin dashboard</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-red-700 text-sm">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="admin@chanderiecoretreat.com"
                                autoComplete="email"
                            />
                            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Logging in...
                            </>
                        ) : (
                            <>
                                <LogIn className="w-5 h-5 mr-2" />
                                Login to Dashboard
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Demo credentials:</p>
                    <p className="font-mono text-xs mt-1">admin@chanderiecoretreat.com / admin123</p>
                    <p className="mt-4">Don't have an admin account? <Link to="/admin/register" className="text-primary-600 font-medium">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;