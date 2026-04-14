import React, { useState, useEffect } from 'react'
import { 
  Users, Calendar, Home, DollarSign, 
  TrendingUp, Package, Settings, LogOut,
  CheckCircle, XCircle, Clock, Search,
  Filter, Download, Eye, Edit, Trash2,
  BarChart, PieChart, Activity
} from 'lucide-react'
import { bookingApi, contactApi, authApi } from '../services/api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [bookings, setBookings] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = () => {
    if (!authApi.isAuthenticated()) {
      navigate('/admin/login')
      toast.error('Please login to access admin panel')
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      
      const [bookingsRes, contactsRes, statsRes] = await Promise.all([
        bookingApi.getAllBookings(),
        contactApi.getAllContacts(),
        bookingApi.getBookingStats()
      ])

      if (bookingsRes?.success) setBookings(bookingsRes.data)
      if (contactsRes?.success) setContacts(contactsRes.data)
      if (statsRes?.success) setStats(statsRes.data)
    } catch (error) {
      toast.error('Failed to fetch data')
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authApi.logout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const updateBookingStatus = async (id, status) => {
    try {
      // In production: await bookingApi.updateBookingStatus(id, status)
      setBookings(prev => prev.map(booking => 
        booking._id === id ? { ...booking, status } : booking
      ))
      toast.success('Booking status updated')
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const updateContactStatus = async (id, status) => {
    try {
      setContacts(prev => prev.map(contact => 
        contact._id === id ? { ...contact, status } : contact
      ))
      toast.success('Contact status updated')
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800',
      new: 'bg-purple-100 text-purple-800',
      read: 'bg-gray-100 text-gray-800',
      replied: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    }
    
    const icons = {
      confirmed: <CheckCircle className="w-4 h-4" />,
      pending: <Clock className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      new: <Clock className="w-4 h-4" />,
      read: <Eye className="w-4 h-4" />,
      replied: <CheckCircle className="w-4 h-4" />,
      archived: <Package className="w-4 h-4" />
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {icons[status]}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    )
  }

  const getTentTypeBadge = (type) => {
    const colors = {
      standard: 'bg-blue-100 text-blue-800',
      deluxe: 'bg-purple-100 text-purple-800',
      family: 'bg-green-100 text-green-800',
      luxury: 'bg-amber-100 text-amber-800'
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${colors[type]}`}>
        {type}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-12 h-12 mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Chanderi Eco Retreat Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">Admin</span>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <BarChart size={18} /> },
              { id: 'bookings', label: 'Bookings', icon: <Calendar size={18} /> },
              { id: 'contacts', label: 'Contacts', icon: <Users size={18} /> },
              { id: 'analytics', label: 'Analytics', icon: <Activity size={18} /> },
              { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 font-medium text-sm rounded-t-lg transition ${
                  activeTab === tab.id
                    ? 'bg-white border-t border-l border-r border-gray-200 text-primary-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold mt-2">{stats?.overview.totalBookings || 0}</p>
                  </div>
                  <div className="text-primary-600">
                    <Calendar size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+12%</span>
                  <span className="text-gray-500 text-sm ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold mt-2">
                      ₹{(stats?.overview.totalRevenue || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-primary-600">
                    <DollarSign size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+15%</span>
                  <span className="text-gray-500 text-sm ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Avg. Booking Value</p>
                    <p className="text-2xl font-bold mt-2">
                      ₹{(stats?.overview.avgBookingValue || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-primary-600">
                    <Home size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+8%</span>
                  <span className="text-gray-500 text-sm ml-2">from last month</span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Occupancy Rate</p>
                    <p className="text-2xl font-bold mt-2">82%</p>
                  </div>
                  <div className="text-primary-600">
                    <Users size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+5%</span>
                  <span className="text-gray-500 text-sm ml-2">from last month</span>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-xl shadow overflow-hidden mb-8">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
                  <Download size={16} className="mr-1" />
                  Export
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tent Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-gray-200">
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{booking.name}</div>
                            <div className="text-sm text-gray-500">{booking.email}</div>
                            <div className="text-xs text-gray-400">{booking.bookingReference}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>{new Date(booking.checkIn).toLocaleDateString('en-IN')}</div>
                            <div className="text-gray-500">to</div>
                            <div>{new Date(booking.checkOut).toLocaleDateString('en-IN')}</div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {getTentTypeBadge(booking.tentType)}
                          <div className="text-sm text-gray-500 mt-1">{booking.guests} guests</div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            ₹{booking.totalAmount.toLocaleString('en-IN')}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          {getStatusBadge(booking.status)}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <select 
                              value={booking.status}
                              onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 border-t text-center">
                <a href="#" className="text-primary-600 hover:text-primary-700 text-sm">
                  View all bookings →
                </a>
              </div>
            </div>
          </>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">All Bookings</h2>
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      className="pl-10 pr-4 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <select className="border rounded-lg px-3 py-2 text-sm">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Cancelled</option>
                  </select>
                  <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">
                    <Download size={16} className="mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stay Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm">{booking.bookingReference}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{booking.name}</div>
                          <div className="text-sm text-gray-500">{booking.email}</div>
                          <div className="text-sm text-gray-500">{booking.phone}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-medium">{getTentTypeBadge(booking.tentType)}</div>
                          <div className="mt-1">
                            {new Date(booking.checkIn).toLocaleDateString('en-IN')} -{' '}
                            {new Date(booking.checkOut).toLocaleDateString('en-IN')}
                          </div>
                          <div className="text-gray-500">{booking.guests} guests</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="font-medium">
                          ₹{booking.totalAmount.toLocaleString('en-IN')}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {getStatusBadge(booking.status)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                            className="text-green-600 hover:text-green-800"
                            title="Confirm"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                            className="text-red-600 hover:text-red-800"
                            title="Cancel"
                          >
                            <XCircle size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Eye size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Edit size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {bookings.length} of {stats?.overview.totalBookings || 0} bookings
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded text-sm">Previous</button>
                <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border rounded text-sm">2</button>
                <button className="px-3 py-1 border rounded text-sm">Next</button>
              </div>
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Contact Inquiries</h2>
                <div className="flex gap-4">
                  <select className="border rounded-lg px-3 py-2 text-sm">
                    <option>All Status</option>
                    <option>New</option>
                    <option>Read</option>
                    <option>Replied</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{contact.name}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900">{contact.email}</div>
                          <div className="text-sm text-gray-500">{contact.phone}</div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate">{contact.subject}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{contact.message}</div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {getStatusBadge(contact.status)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateContactStatus(contact._id, 'read')}
                            className="text-blue-600 hover:text-blue-800"
                            title="Mark as Read"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => updateContactStatus(contact._id, 'replied')}
                            className="text-green-600 hover:text-green-800"
                            title="Mark as Replied"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && stats && (
          <div className="space-y-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-bold mb-6 text-gray-900">Revenue Overview</h3>
              <div className="h-64 flex items-end space-x-2">
                {stats.monthly.map((month, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary-500 rounded-t"
                      style={{ height: `${(month.revenue / 600000) * 200}px` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">
                      {month._id.month}/{month._id.year}
                    </div>
                    <div className="text-sm font-medium">
                      ₹{(month.revenue / 1000).toFixed(0)}K
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Booking Status */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-6 text-gray-900">Booking Status</h3>
                <div className="space-y-4">
                  {stats.byStatus.map((status) => (
                    <div key={status._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusBadge(status._id)}
                        <span className="ml-2">{status.count} bookings</span>
                      </div>
                      <div className="font-medium">
                        ₹{status.revenue.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tent Type Distribution */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-6 text-gray-900">Tent Type Distribution</h3>
                <div className="space-y-4">
                  {stats.byTentType.map((tent) => (
                    <div key={tent._id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getTentTypeBadge(tent._id)}
                        <span className="ml-2">{tent.count} bookings</span>
                      </div>
                      <div className="font-medium">
                        ₹{tent.revenue.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold mb-6 text-gray-900">Settings</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">General Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Enable Email Notifications</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Maintenance Mode</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Email Templates</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Booking Confirmation Email
                  </button>
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Payment Reminder Email
                  </button>
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Welcome Email
                  </button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Danger Zone</h4>
                <div className="space-y-4">
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Clear All Data
                  </button>
                  <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPage