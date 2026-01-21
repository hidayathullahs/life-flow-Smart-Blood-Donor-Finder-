import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import SearchPage from '@/pages/Search';
import DonorDetails from '@/pages/DonorDetails';
import AdminLogin from '@/admin/pages/AdminLogin';
import ForgotPassword from '@/admin/pages/ForgotPassword';


import Dashboard from '@/admin/pages/Dashboard';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="flex flex-col min-h-screen bg-background text-foreground font-sans antialiased selection:bg-red-100 selection:text-red-900">
                    <Routes>
                        {/* Public Routes with Layout */}
                        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                        <Route path="/search" element={<><Navbar /><SearchPage /><Footer /></>} />
                        <Route path="/donor/:id" element={<><Navbar /><DonorDetails /><Footer /></>} />

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
                        <Route
                            path="/admin/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>

                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="colored"
                    />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
