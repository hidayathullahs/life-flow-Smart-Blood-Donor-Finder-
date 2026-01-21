import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Heart, UserPlus, Phone, ShieldCheck, Activity, Droplet, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-sm font-medium animate-fade-in-up">
                                <Droplet className="h-4 w-4 fill-current" />
                                Save Lives Today
                            </div>

                            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                                Find Blood Donors <span className="text-primary">In Your Area</span>
                            </h1>

                            <p className="text-lg text-slate-600 leading-relaxed">
                                Connect with eligible blood donors instantly. LifeFlow helps you find verified donors in your city when every second counts.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                                <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 bg-primary hover:bg-red-700" asChild>
                                    <Link to="/search">
                                        <Search className="mr-2 h-5 w-5" />
                                        Search Donors
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-2 hover:bg-slate-50 transition-all duration-300" asChild>
                                    <Link to="/admin/login">
                                        Admin Portal <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-100 mt-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">24/7</h3>
                                    <p className="text-sm text-slate-500">Available</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">100%</h3>
                                    <p className="text-sm text-slate-500">Verified</p>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Fast</h3>
                                    <p className="text-sm text-slate-500">Response</p>
                                </div>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="flex-1 w-full max-w-xl lg:max-w-none relative">
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 aspect-[4/3] group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                                <img
                                    src="https://images.pexels.com/photos/12820057/pexels-photo-12820057.jpeg"
                                    alt="Medical volunteer helping donor"
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How BloodLink Works Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How LifeFlow Works</h2>
                        <p className="text-slate-500 max-w-xl mx-auto text-lg">Simple, fast, and reliable way to connect with blood donors.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Search className="h-8 w-8 text-primary" />}
                            title="Search by Blood Group"
                            desc="Filter donors by blood type and location to find the perfect match quickly."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="h-8 w-8 text-primary" />}
                            title="Verified Donors Only"
                            desc="All donors are verified and eligible (90+ days since last donation)."
                        />
                        <FeatureCard
                            icon={<Phone className="h-8 w-8 text-primary" />}
                            title="Instant Contact"
                            desc="Call or message donors directly via phone or WhatsApp with one click."
                        />
                    </div>
                </div>
            </section>

            {/* Every Drop Counts CTA Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-16 text-center border border-slate-100 max-w-5xl mx-auto">
                        <div className="mx-auto bg-red-50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                            <Heart className="h-10 w-10 text-primary fill-primary" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Every Drop Counts</h2>
                        <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Join our community of verified blood donors and help save lives in your area.
                            Your small act of kindness can make a world of difference.
                        </p>
                        <Button size="lg" className="h-14 px-10 text-lg font-semibold rounded-full shadow-xl shadow-red-500/20 hover:scale-105 transition-all bg-primary hover:bg-red-700" asChild>
                            <Link to="/search">
                                Start Searching <div className="ml-2">→</div>
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-300 group">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export default Home;
