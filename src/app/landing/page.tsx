/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { useState, useEffect } from 'react';
import { MessageCircle, Video, Share, Users, Zap, Shield, ArrowRight, Play, Star, Check, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';
import { localURL } from '@/lib/url';

export default function SyncRoomLanding() {
    const [isVisible, setIsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const router = useRouter();
    const { isAuthenticated, isInitialized, checkAuthStatus, user } = useAuthStore();

    useEffect(() => {
        setIsVisible(true);
        async function welcome() {
            try {
                const res = await axios.get(`${localURL}/welcome`);
                const res2 = await axios.get(`${localURL}/auth/status`, { withCredentials: true });
                const res3 = await axios.get(`${localURL}/check`, { withCredentials: true });
                console.log(res.data)
                console.log(res2.data);
                console.log(res3.data);
                console.log(user)
            } catch (error) {
                console.log(error)
            }
        }
        welcome();
    }, []);

    useEffect(() => {
        if (!isInitialized) {
            checkAuthStatus(); // Lazy initialize if page is refreshed
        }
    }, [isInitialized, checkAuthStatus]);

    useEffect(() => {
        if (isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, router]);


    const features = [
        {
            icon: MessageCircle,
            title: "Real-time Chat",
            description: "Instant messaging with your team members in organized rooms",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: Video,
            title: "Video Calls",
            description: "High-quality video conferencing (coming soon)",
            gradient: "from-violet-500 to-purple-600"
        },
        {
            icon: Share,
            title: "File Sharing",
            description: "Share PDFs, images, and documents seamlessly",
            gradient: "from-emerald-500 to-teal-500"
        },
        {
            icon: Users,
            title: "Team Rooms",
            description: "Create dedicated spaces for different projects and teams",
            gradient: "from-pink-500 to-rose-500"
        }
    ];

    const testimonials = [
        { name: "Sarah Chen", role: "Product Manager", content: "SyncRoom has transformed how our team collaborates. The room-based approach keeps everything organized." },
        { name: "Marcus Johnson", role: "Software Engineer", content: "Finally, a platform that combines chat and file sharing in an intuitive way. Love the Discord-like experience." },
        { name: "Emily Rodriguez", role: "Designer", content: "Sharing design files and getting instant feedback has never been easier. Can't wait for video calls!" }
    ];

    return (
        <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-gray-50">
            {/* Enhanced Background Effects - Matching main page */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/5 dark:bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 dark:bg-purple-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none"></div>

            {/* Navigation */}
            <motion.nav
                className="relative z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm"
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                                SyncRoom
                            </h1>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Features</a>
                            <a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">About</a>
                            <a href="#contact" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Contact</a>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href={'/login'}>
                                <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 transition-colors">
                                    Sign In
                                </button>
                            </Link>
                            <button className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all transform hover:scale-105 shadow-lg">
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
                {/* Header gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent"></div>
            </motion.nav>

            {/* Hero Section */}
            <section className="relative max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-12 border border-gray-200/50 dark:border-gray-800/50 shadow-lg mb-12">
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Sparkles className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <h2 className="text-5xl md:text-7xl font-bold mb-6">
                            <span className="text-gray-900 dark:text-gray-50">Collaborate</span>
                            <br />
                            <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                                Without Limits
                            </span>
                        </h2>

                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Create dedicated rooms for your teams, chat in real-time, share files instantly, and connect through video calls.
                            Experience collaboration like never before.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <button className="group px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-violet-500/25 flex items-center space-x-2">
                                <span>Start Collaborating</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="group px-8 py-4 bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl font-semibold text-lg transition-all flex items-center space-x-2 text-gray-900 dark:text-gray-50">
                                <Play className="w-5 h-5" />
                                <span>Watch Demo</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Visual */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md mb-4">
                                    <MessageCircle className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-50">Team Chat</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Organized conversations in dedicated rooms</p>
                            </div>
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-md mb-4">
                                    <Share className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-50">File Sharing</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Share documents, images, and more</p>
                            </div>
                            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300">
                                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md mb-4">
                                    <Video className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-50">Video Calls</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Coming soon - HD video conferencing</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Floating Elements */}
                <div className="absolute top-20 right-8 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 dark:from-pink-500/20 dark:to-rose-500/20 rounded-full blur-2xl animate-pulse delay-700 pointer-events-none"></div>
                <div className="absolute bottom-40 left-12 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-2xl animate-pulse delay-1000 pointer-events-none"></div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-20 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Everything You Need</h3>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Powerful features designed to enhance team collaboration and productivity
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105"
                                onMouseEnter={() => setActiveFeature(index)}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-50">{feature.title}</h4>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Separator */}
            <motion.div
                className="flex items-center justify-center gap-4 py-12"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500/20 to-purple-500/20 dark:from-violet-500/30 dark:to-purple-500/30 rounded-full flex items-center justify-center border border-violet-200 dark:border-violet-800">
                    <Star className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div className="flex-1 max-w-xs h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
            </motion.div>

            {/* Testimonials */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Heart className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-50">Loved by Teams</h3>
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-400">See what others are saying about SyncRoom</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">&#34;{testimonial.content}&#34;</p>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-gray-50">{testimonial.name}</p>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl p-12 border border-gray-200/50 dark:border-gray-800/50 shadow-lg">
                            <h3 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-50">Ready to Transform Your Team?</h3>
                            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                                Join thousands of teams already using SyncRoom to collaborate more effectively
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                <button className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg">
                                    Get Started Free
                                </button>
                                <button className="px-8 py-4 bg-white/60 dark:bg-gray-800/60 hover:bg-white/80 dark:hover:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl font-semibold text-lg transition-all text-gray-900 dark:text-gray-50">
                                    Schedule Demo
                                </button>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">No credit card required • Free forever plan available</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 dark:text-gray-50">SyncRoom</h4>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">Collaborate without limits</p>
                        </div>
                        <div>
                            <h5 className="font-semibold mb-4 text-gray-900 dark:text-gray-50">Product</h5>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Updates</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold mb-4 text-gray-900 dark:text-gray-50">Company</h5>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Careers</a></li>
                                <li><a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Contact</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-semibold mb-4 text-gray-900 dark:text-gray-50">Support</h5>
                            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                                <li><a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Privacy</a></li>
                                <li><a href="#" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200/50 dark:border-gray-800/50 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
                        <p>&copy; {new Date().getFullYear()} SyncRoom. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}