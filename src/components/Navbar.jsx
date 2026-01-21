import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Droplet, Menu, X, LayoutDashboard, LogIn, Home, Search, Lock, Activity } from 'lucide-react';

const Navbar = () => {
    const { currentUser } = useAuth();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    // Close menu when route changes
    React.useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    // Determine current user object (from context or local storage for demo)
    const user = currentUser || JSON.parse(localStorage.getItem('bloodlink_user'));

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-red-500/10 p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-primary transition-colors">
                        LifeFlow
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-slate-600'}`}>
                        <div className="flex items-center gap-2">
                            <Home className="h-4 w-4" /> Home
                        </div>
                    </Link>
                    <Link to="/search" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/search') ? 'text-primary' : 'text-slate-600'}`}>
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4" /> Find Donors
                        </div>
                    </Link>
                    <Link to="/admin/login" className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/admin/login') ? 'text-primary' : 'text-slate-600'}`}>
                        <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4" /> Admin
                        </div>
                    </Link>
                </div>

                {/* Right Side Actions */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <Link to="/admin/dashboard">
                            <Button className="rounded-full px-6 font-medium shadow-lg shadow-red-500/20 bg-primary hover:bg-red-700">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/search">
                            <Button className="rounded-full px-6 font-medium shadow-lg shadow-red-500/20 bg-primary hover:bg-red-700 h-10">
                                <Search className="mr-2 h-4 w-4" /> Search Donors
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X /> : <Menu />}
                </button>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="absolute top-[80px] left-0 right-0 bg-white border-b shadow-xl p-4 md:hidden flex flex-col space-y-4 animate-in slide-in-from-top-2">
                        <Link to="/" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-600">
                            <Home className="h-4 w-4" /> Home
                        </Link>
                        <Link to="/search" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-600">
                            <Search className="h-4 w-4" /> Find Donors
                        </Link>
                        <Link to="/admin/login" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-slate-50 text-slate-600">
                            <Lock className="h-4 w-4" /> Admin Portal
                        </Link>
                        <div className="pt-2 border-t">
                            <Link to="/search">
                                <Button className="w-full rounded-full bg-primary hover:bg-red-700">
                                    Search Donors
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
