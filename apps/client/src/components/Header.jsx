import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Wallet, ChevronDown } from 'lucide-react';

const Header = ({ onMenuClick }) => {
    const [address, setAddress] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setAddress(user.wallet_address);
        }

        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const formatAddress = (addr) => {
        if (!addr) return 'Disconnected';
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    };

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`h-20 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40 transition-all duration-300 ${scrolled
                ? 'bg-black-soft/95 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50'
                : 'bg-black-soft/40 backdrop-blur-md border-b border-white/5'
                }`}
        >
            {/* Left Side: Menu Toggle & Stats */}
            <div className="flex items-center gap-4 sm:gap-8">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-xl bg-white/5 text-gray-400 hover:text-gold hover:bg-gold/10 transition-all border border-white/10"
                >
                    <Menu size={24} />
                </button>

                {/* Stats Section */}
                <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">Energy</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-white">450.00</span>
                            <span className="text-[9px] text-gold font-bold">NRJ</span>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-0.5">LUXE Balance</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-sm font-bold text-white">1,250.00</span>
                            <span className="text-[9px] text-gold font-bold">LX</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Wallet, Notifications, Profile */}
            <div className="flex items-center gap-3 sm:gap-5">
                {/* Wallet Status Badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/5 border border-gold/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse"></div>
                    <span className="text-xs font-mono text-gold-light">
                        {formatAddress(address)}
                    </span>
                </div>

                <div className="h-8 w-px bg-white/10 mx-1"></div>

                {/* Notification Bell */}
                <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 group">
                    <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full border-2 border-black" />
                </button>

                {/* Profile Section */}
                <button className="flex items-center gap-2 p-1 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all group">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-white/20 group-hover:border-gold/50 transition-colors">
                        <img
                            className="w-full h-full object-cover"
                            alt="User profile"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBFKaOGEqx67axoW6iLXhSdvdyvxDb170U5VryWHnElt8B3QKCoot9mI3RUcatVZuM5rltR8cmExLDnrl_qsNwJBKSWJ6IESqKE7jtV5trks0gBD0ikRyggNLDZju4NL_dHT_qL4IKZl2YkK5nhwjM81QMVMHF5cs_4VGOBa2KfROplMXKA7hoh0uPc5xu1YaEdSa9r7MrlepExGa4G1dGmzZ3j6X_251LoiCgf46PRS98ilHdr2GxmH1QaHqcYhB-sHIbLdRdoAjrj"
                        />
                    </div>
                    <ChevronDown size={14} className="text-gray-500 group-hover:text-gold transition-colors" />
                </button>
            </div>
        </motion.header>
    );
};

export default Header;
