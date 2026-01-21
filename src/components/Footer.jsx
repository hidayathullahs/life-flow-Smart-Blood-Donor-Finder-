import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Activity, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto border-t border-slate-800">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-red-500/10 p-2 rounded-full">
                                <Activity className="h-6 w-6 text-red-500" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">LifeFlow</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Connecting blood donors with those in need. Every drop counts in saving lives.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-red-400 transition-colors">Home</a></li>
                            <li><a href="/search" className="hover:text-red-400 transition-colors">Find Donors</a></li>
                            <li><a href="/admin/login" className="hover:text-red-400 transition-colors">Admin Portal</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-red-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-red-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                info@lifeflow.com
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                +1 (555) 123-4567
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
                    <p>© {new Date().getFullYear()} LifeFlow. All rights reserved.</p>
                    <div className="flex items-center gap-1 mt-2 md:mt-0">
                        Made with <Heart className="h-3 w-3 text-red-900 fill-red-900 mx-1" /> by Emergent
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
