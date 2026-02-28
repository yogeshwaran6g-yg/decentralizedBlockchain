import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetSlotActivation, useUpdateSlotActivation } from '../hooks/useSlotActivation';

const LEVELS = [
    {
        id: 1,
        title: "LEVEL 01",
        igtBalance: "1,450",
        cesValue: "420",
        icon: "rocket_launch",
        glowColor: "glow-purple",
        planetColor: "glow-gold"
    },
    {
        id: 2,
        title: "LEVEL 02",
        igtBalance: "2,800",
        cesValue: "850",
        icon: "public",
        glowColor: "glow-blue",
        planetColor: "bg-blue-400"
    },
    {
        id: 3,
        title: "LEVEL 03",
        igtBalance: "5,000",
        cesValue: "1,200",
        icon: "hub",
        glowColor: "glow-amber",
        planetColor: "bg-amber-400"
    },
    {
        id: 4,
        title: "LEVEL 04",
        igtBalance: "12,500",
        cesValue: "3,400",
        icon: "visibility",
        glowColor: "glow-red",
        planetColor: "bg-red-400"
    },
    {
        id: 5,
        title: "LEVEL 05",
        igtBalance: "25,000",
        cesValue: "7,200",
        icon: "auto_awesome_motion",
        glowColor: "glow-indigo",
        planetColor: "bg-indigo-400"
    },
    {
        id: 6,
        title: "LEVEL 06",
        igtBalance: "50,000",
        cesValue: "15,000",
        icon: "auto_awesome",
        glowColor: "glow-gold",
        planetColor: "bg-white"
    }
];

const MatrixOrbital = ({ level, isActive, percentage = 85 }) => {
    return (
        <div className="relative w-full h-36 flex items-center justify-center -mt-2 overflow-hidden text-white">
            {/* SVG Orbital System - Static Premium Look */}
            <svg viewBox="0 0 200 200" className="h-full w-auto relative z-10 drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                <defs>
                    <radialGradient id="highCore">
                        <stop offset="0%" stopColor="#FFF" />
                        <stop offset="20%" stopColor="#FFF2AD" />
                        <stop offset="50%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <filter id="superGlow">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Cyber Rings - Static */}
                <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.5" strokeDasharray="5 5" />
                <circle cx="100" cy="100" r="65" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="1" strokeDasharray="30 10" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(212,175,55,0.05)" strokeWidth="0.5" />

                {/* Static Progress Ring */}
                <circle
                    cx="100" cy="100" r="85" fill="none" stroke="#FFD700" strokeWidth="1"
                    strokeDasharray={`${(percentage / 100) * 534} 534`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                    opacity={isActive ? 0.6 : 0.2}
                />

                {/* Central Power Core - Static White Origin */}
                <circle
                    cx="100" cy="100" r="22"
                    fill="url(#highCore)"
                    filter="url(#superGlow)"
                    opacity="0.8"
                />
                <circle cx="100" cy="100" r="16" fill="#FFF" className="shadow-2xl" />
                <text
                    x="100" y="101"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#09090b"
                    className="text-[14px] font-black italic select-none"
                >U</text>

                {/* Static Nodes */}
                <g style={{ transformOrigin: "100px 100px" }}>
                    <circle cx="100" cy="35" r="3" fill="#FFD700" filter="url(#superGlow)" />
                </g>
                <g style={{ transformOrigin: "100px 100px" }}>
                    <circle cx="165" cy="100" r="4" fill="#00FF9D" opacity={isActive ? 1 : 0.3} filter="url(#superGlow)" />
                </g>

                {/* Static Particles */}
                {[...Array(6)].map((_, i) => (
                    <circle
                        key={i} cx={100 + (Math.sin(i) * 60)} cy={100 + (Math.cos(i) * 60)}
                        r="0.5" fill="#FFD700" opacity="0.4"
                    />
                ))}
            </svg>
        </div>
    );
};

const SlotLevelCard = ({ level, status, cost, energy, isActive, onActivate, earnings }) => {
    const isLocked = status === 'locked';
    // Mock percentage for visual effect
    const syncRate = isActive ? (94.5 + Math.random() * 5).toFixed(1) : (level * 8).toFixed(1);

    return (
        <div className="group relative">
            <div className={`bg-black-soft rounded-3xl overflow-hidden border ${isActive ? 'border-accent-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.15)]' : 'border-white/5'} transition-all duration-300`}>
                {/* Top Badge Section */}
                <div className="flex justify-between items-start p-2">
                    <div className="bg-white/5 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                        <span className="text-white text-[9px] font-black italic">{cost}$</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-widest ${isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-zinc-500 border border-white/10'}`}>
                        {isActive ? 'ACTIVE' : isLocked ? 'LOCKED' : 'AVAILABLE'}
                    </div>
                </div>

                {/* Main Visual & "Number Style" Level Display */}
                <div className="px-5 pb-0.5 relative">
                    <MatrixOrbital level={level} isActive={isActive} percentage={parseFloat(syncRate)} />

                    <div className="flex flex-col items-center mt-0.5 mb-1.5">
                        <div className="flex items-center gap-1.5 opacity-60">
                            <span className="text-[6px] text-accent-gold font-black uppercase tracking-[0.4em]">Matrix Node</span>
                        </div>
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-zinc-600 text-[10px] font-black italic uppercase tracking-tighter">Lvl</span>
                            <h3 className="text-white text-3xl font-black italic tracking-tighter uppercase leading-none">
                                {level < 10 ? `0${level}` : level}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 border-y border-white/5 divide-x divide-white/5 bg-white/2">
                    <div className="p-1 text-center">
                        <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">Level Income</span>
                        <span className="text-[10px] font-black text-white italic tracking-tighter">{earnings?.level || '100'}</span>
                    </div>
                    <div className="p-1 text-center">
                        <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">Referral Income</span>
                        <span className="text-[10px] font-black text-white italic tracking-tighter">{earnings?.referral || '200'}</span>
                    </div>
                    <div className="p-1 text-center">
                        <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">Recycle</span>
                        <span className="text-[10px] font-black text-white italic tracking-tighter">{earnings?.recycle || '40'}</span>
                    </div>
                </div>

                {/* Specific Progress Bar Style (Orange - % - Grey) */}
                <div className="px-3 py-1.5">
                    <div className="flex justify-end mb-0.5">
                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-zinc-500 fill-none stroke-current stroke-2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-0.5 bg-accent-gold rounded-full relative overflow-hidden"></div>
                        <span className="text-[8px] font-bold text-white/90 italic tracking-tighter">{syncRate}%</span>
                        <div className="flex-1 h-0.5 bg-white/10 rounded-full"></div>
                    </div>
                </div>

                {/* Action Section */}
                <div className="p-2">
                    {!isActive ? (
                        <button
                            disabled={isLocked}
                            onClick={() => onActivate?.(level)}
                            className={`group/btn w-full py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] relative overflow-hidden transition-all duration-300
                                ${isLocked
                                    ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-white/5'
                                    : 'bg-linear-to-r from-[#FFD700] via-[#FDB931] to-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] active:scale-95'
                                }`}
                        >
                            <span className="relative z-10">{isLocked ? 'Locked' : 'ACTIVATE NOW'}</span>
                        </button>
                    ) : (
                        <div className="w-full py-2.5 rounded-xl bg-white/5 border border-accent-gold/20 text-accent-gold font-black text-[8px] uppercase tracking-[0.4em] text-center italic flex items-center justify-center gap-2">
                            <span className="size-1 bg-accent-gold rounded-full"></span>
                            OPERATIONAL
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const SlotActivation = () => {
    let userId = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser && storedUser !== 'undefined') {
            userId = JSON.parse(storedUser)?.id;
        }
    } catch (e) {
        console.error('Error parsing user from localStorage', e);
    }

    const { data: slotActivation, isLoading, error } = useGetSlotActivation(userId || '');
    const { mutate: updateSlotActivation } = useUpdateSlotActivation(userId || '');

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-gold"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px] text-white">
                <div className="text-center p-8 bg-black-soft rounded-3xl border border-red-500/20">
                    <span className="material-symbols-outlined text-red-500 text-4xl mb-4">report</span>
                    <h3 className="text-xl font-black italic uppercase">System Error</h3>
                    <p className="text-zinc-500 text-sm mt-2">{error.message}</p>
                </div>
            </div>
        );
    }

    const levels = [
        { level: 1, cost: "20", status: "active", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 2, cost: "40", status: "available", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 3, cost: "80", status: "locked", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 4, cost: "160", status: "locked", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 5, cost: "320", status: "locked", earnings: { level: "100", referral: "200", recycle: "40" } },
        { level: 6, cost: "640", status: "locked", earnings: { level: "100", referral: "200", recycle: "40" } },
    ];

    return (
        <div className="space-y-12 pb-24 text-white">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-px bg-accent-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]"></div>
                        <span className="text-[7px] font-black tracking-[0.3em] text-accent-gold uppercase drop-shadow-sm">Protocol Phase 01</span>
                    </div>
                    <h1 className="text-xl md:text-3xl font-black italic tracking-tighter uppercase leading-[0.9]">
                        <span className="text-zinc-950 block">Matrix</span>
                        <span className="text-accent-gold block drop-shadow-[0_2px_4px_rgba(212,175,55,0.3)]">Activation</span>
                    </h1>
                </div>

                <div className="bg-black-soft p-3.5 rounded-xl border border-white/5 flex items-center gap-4 shadow-2xl">
                    <div className="text-center">
                        <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">Global Power</span>
                        <span className="text-base font-black italic tracking-tighter">42.5 <span className="text-[8px] text-accent-gold font-bold">P/h</span></span>
                    </div>
                    <div className="w-px h-5 bg-white/10"></div>
                    <div className="text-center">
                        <span className="text-[6px] text-zinc-500 font-bold uppercase tracking-widest block mb-0.5">Active Slots</span>
                        <span className="text-base font-black text-accent-gold italic tracking-tighter">12 <span className="text-[8px] text-zinc-400 font-bold">Units</span></span>
                    </div>
                </div>
            </div>

            {/* Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 sm:gap-10">
                {levels.map((lvl) => (
                    <SlotLevelCard
                        key={lvl.level}
                        {...lvl}
                        isActive={lvl.level === 1}
                        onActivate={(l) => updateSlotActivation({ level: l })}
                    />
                ))}
            </div>

            {/* Bottom Footer Info */}
            <div className="mt-16 p-6 bg-black-soft rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/5 blur-[80px] -z-10 group-hover:bg-accent-gold/10 transition-all duration-700"></div>
                <div className="max-w-md text-center md:text-left">
                    <h4 className="text-base font-black italic uppercase mb-0.5">Expansion Protocol</h4>
                    <p className="text-zinc-500 text-[10px] font-medium leading-relaxed italic">
                        "Secure your position in the matrix. Every activation increases your node weight and network dominance."
                    </p>
                </div>
                <div className="flex gap-2.5">
                    <button className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all">
                        Technical Specs
                    </button>
                    <button className="px-7 py-2 bg-accent-gold text-black rounded-lg text-[8px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:scale-105 transition-all">
                        Node Refresh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SlotActivation;
