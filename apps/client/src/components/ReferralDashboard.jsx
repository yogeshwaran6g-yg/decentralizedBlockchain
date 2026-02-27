import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReferralDashboard = () => {
    const [hoveredNode, setHoveredNode] = React.useState(null);

    const orbitData = [
        { id: 'inner', size: 240, duration: 25, planets: [{ id: 'l1-1', size: 52, color: '#FF8C00', delay: 0, label: 'L1: 24 Users', detail: '10% Yield Sharing' }] },
        {
            id: 'mid', size: 400, duration: 45, planets: [
                { id: 'l2-1', size: 42, color: '#FF4500', delay: 0, label: 'L2: 120 Users', detail: '5% Indirect' },
                { id: 'l2-2', size: 38, color: '#FFA500', delay: 180, label: 'L2: Active Node', detail: 'Relay Active' }
            ]
        },
        {
            id: 'outer', size: 560, duration: 65, planets: [
                { id: 'l3-1', size: 32, color: '#FFD700', delay: 0, label: 'L3: 1,306 Users', detail: '2% Global' },
                { id: 'l3-2', size: 30, color: '#B08D57', delay: 120, label: 'L3: Inactive', detail: 'Waiting for Sync' },
                { id: 'l3-3', size: 28, color: '#C0C0C0', delay: 240, label: 'L3: Peer-to-Peer', detail: 'Encrypted Link' }
            ]
        },
    ];

    const generateStars = () => {
        return Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.1,
            duration: Math.random() * 3 + 2
        }));
    };
    const stars = React.useMemo(() => generateStars(), []);

    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-1 sm:p-0">
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-gold-start/10 transition-colors">
                        <span className="material-symbols-outlined !text-4xl sm:!text-5xl">person_add</span>
                    </div>
                    <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Direct Referrals</p>
                    <div className="mt-2 sm:mt-4 flex items-end gap-2 sm:gap-3">
                        <h3 className="text-xl sm:text-2xl font-black">124</h3>
                        <span className="text-green-400 text-[10px] font-bold mb-0.5 sm:mb-1">+12%</span>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-gold-start/10 transition-colors">
                        <span className="material-symbols-outlined !text-4xl sm:!text-5xl">groups_3</span>
                    </div>
                    <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Total Team Size</p>
                    <div className="mt-2 sm:mt-4 flex items-end gap-2 sm:gap-3">
                        <h3 className="text-xl sm:text-2xl font-black">1,450</h3>
                        <span className="text-green-400 text-[10px] font-bold mb-0.5 sm:mb-1">+5%</span>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 text-white/5 group-hover:text-gold-start/10 transition-colors">
                        <span className="material-symbols-outlined !text-4xl sm:!text-5xl">bolt</span>
                    </div>
                    <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Referral Earnings</p>
                    <div className="mt-2 sm:mt-4 flex items-end gap-2 sm:gap-3">
                        <h3 className="text-xl sm:text-2xl font-black gold-gradient-text">12,850.50</h3>
                        <span className="text-silver text-[9px] font-bold mb-1 ml-0.5">NRJ</span>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border-gold-start/20 flex flex-col justify-between group/card hover:border-gold-start/40 transition-colors">
                    <div>
                        <p className="text-silver/60 text-[9px] sm:text-[10px] font-medium uppercase tracking-wider">Referral Link</p>
                        <div className="mt-2 p-2 bg-white/5 rounded-lg border border-white/5 group-hover/card:border-gold-start/20 transition-all">
                            <p className="text-[10px] font-mono text-silver truncate">refer.network/user/0x7...f92</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText('refer.network/user/0x71c...4f92');
                        }}
                        className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-gold-start/30 text-gold-start text-[9px] sm:text-[10px] font-bold hover:bg-gold-start hover:text-primary transition-all active:scale-95 shadow-lg shadow-gold-start/5"
                    >
                        <span className="material-symbols-outlined text-sm">content_copy</span>
                        Copy Link
                    </button>
                </div>
            </div>

            {/* Orbital Section */}
            <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 overflow-hidden relative min-h-[500px] flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold-start/5 blur-[100px] -z-10"></div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 relative z-20 gap-3">
                    <h2 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2 sm:gap-3">
                        <span className="material-symbols-outlined text-gold-start text-base sm:text-xl">star</span>
                        <span className="truncate">NETWORK ARCHITECTURE</span>
                    </h2>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-gold-start/10 rounded-full text-[8px] sm:text-[10px] text-gold-start border border-gold-start/20 uppercase tracking-widest font-bold flex items-center gap-1.5">
                            <span className="size-1 bg-gold-start rounded-full animate-pulse"></span>
                            Real-time Visualization
                        </span>
                    </div>
                </div>

                <div className="relative flex-grow flex items-center justify-center perspective-[2000px] py-12">
                    {/* Star Field Background */}
                    <div className="absolute inset-0 pointer-events-none">
                        {stars.map(star => (
                            <motion.div
                                key={star.id}
                                className="absolute bg-white rounded-full"
                                style={{
                                    top: star.top,
                                    left: star.left,
                                    width: star.size,
                                    height: star.size,
                                    opacity: star.opacity
                                }}
                                animate={{ opacity: [star.opacity, star.opacity * 2, star.opacity] }}
                                transition={{ duration: star.duration, repeat: Infinity }}
                            />
                        ))}
                    </div>

                    {/* Perspective Container */}
                    <div className="relative w-full h-full flex items-center justify-center transform-gpu" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(50deg)' }}>

                        {/* Orbit Rings and Planets */}
                        {orbitData.map((orbit) => (
                            <div
                                key={orbit.id}
                                className="absolute rounded-full border border-white/10"
                                style={{
                                    width: orbit.size,
                                    height: orbit.size,
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    transformStyle: 'preserve-3d',
                                    background: 'radial-gradient(circle, transparent 60%, rgba(255,255,255,0.03) 100%)'
                                }}
                            >
                                {orbit.planets.map((planet) => (
                                    <motion.div
                                        key={planet.id}
                                        className="absolute w-full h-full"
                                        style={{
                                            top: 0,
                                            left: 0,
                                            transformStyle: 'preserve-3d'
                                        }}
                                        animate={{ rotateZ: 360 }}
                                        transition={{
                                            duration: orbit.duration,
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: -(planet.delay / 360) * orbit.duration
                                        }}
                                    >
                                        <motion.div
                                            className="absolute pointer-events-none"
                                            style={{
                                                top: '50%',
                                                left: '100%',
                                                width: 0,
                                                height: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transformStyle: 'preserve-3d'
                                            }}
                                            animate={{ rotateZ: -360 }}
                                            transition={{
                                                duration: orbit.duration,
                                                repeat: Infinity,
                                                ease: "linear",
                                                delay: -(planet.delay / 360) * orbit.duration
                                            }}
                                        >
                                            <div
                                                className="pointer-events-auto"
                                                style={{
                                                    transform: 'rotateX(-50deg)',
                                                    transformStyle: 'preserve-3d'
                                                }}
                                            >
                                                <motion.div
                                                    className="cursor-pointer"
                                                    whileHover={{ scale: 1.3 }}
                                                    onHoverStart={() => setHoveredNode(planet)}
                                                    onHoverEnd={() => setHoveredNode(null)}
                                                >
                                                    <div
                                                        className="rounded-full gold-gradient-bg border-[3px] border-[#0a0a0a] relative"
                                                        style={{
                                                            width: planet.size,
                                                            height: planet.size,
                                                            boxShadow: `0 0 25px rgba(255, 140, 0, 0.4), inset 0 0 10px rgba(0,0,0,0.3)`
                                                        }}
                                                    >
                                                        {/* Inner icon for consistency with center */}
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-black !text-[12px] opacity-40">person</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        ))}

                        {/* Central Sun/User */}
                        <div
                            className="absolute z-50"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%) rotateX(-50deg)',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <motion.div
                                className="size-20 sm:size-24 gold-gradient-bg rounded-full border-[6px] border-[#0a0a0a] flex items-center justify-center cursor-pointer relative"
                                style={{
                                    boxShadow: '0 0 50px rgba(255, 140, 0, 0.4), inset 0 0 15px rgba(0,0,0,0.3)'
                                }}
                                animate={{
                                    scale: [1, 1.08, 1],
                                    boxShadow: [
                                        '0 0 40px rgba(255, 140, 0, 0.3)',
                                        '0 0 70px rgba(255, 140, 0, 0.5)',
                                        '0 0 40px rgba(255, 140, 0, 0.3)'
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <span className="material-symbols-outlined text-black !text-3xl font-black">person</span>

                                {/* Inner glow particles */}
                                <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-ping opacity-10"></div>
                            </motion.div>

                            {/* Central Node Label - Positioned absolutely to not affect centering */}
                            <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-center w-max pointer-events-none">
                                <p className="text-[10px] font-black gold-gradient-text uppercase tracking-[0.2em] drop-shadow-lg">NODE CONTROLLER</p>
                                <p className="text-[8px] text-silver/60 font-bold mt-0.5 uppercase">Network Core</p>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Info Overlay */}
                    <AnimatePresence>
                        {hoveredNode && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="absolute bottom-6 right-6 p-4 rounded-xl border border-white/10 z-[100] min-w-[160px]"
                                style={{
                                    background: 'rgba(11, 11, 15, 0.9)',
                                    backdropFilter: 'blur(12px)',
                                    boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${hoveredNode.color}22`
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="size-2 rounded-full" style={{ backgroundColor: hoveredNode.color, boxShadow: `0 0 8px ${hoveredNode.color}` }}></div>
                                    <p className="text-white text-[10px] font-black uppercase tracking-widest">{hoveredNode.label}</p>
                                </div>
                                <p className="text-silver/60 text-[9px] font-bold leading-relaxed">{hoveredNode.detail}</p>
                                <div className="mt-3 overflow-hidden h-1 bg-white/5 rounded-full">
                                    <motion.div
                                        className="h-full"
                                        style={{ backgroundColor: hoveredNode.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>



            {/* Recent Referrals Table */}
            <div className="glass-card rounded-2xl sm:rounded-3xl overflow-hidden mt-4 lg:mt-6">
                <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-sm sm:text-lg font-bold">Network Activity</h3>
                    <button className="text-[9px] sm:text-xs text-silver/60 hover:text-gold-start transition-colors font-bold uppercase tracking-widest flex items-center gap-2 shrink-0">
                        VIEW ALL
                        <span className="material-symbols-outlined text-[10px] sm:text-sm">arrow_forward</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="text-left text-[10px] text-silver/40 uppercase tracking-[0.2em] bg-white/[0.02]">
                                <th className="px-4 sm:px-8 py-4 font-black">Wallet Address</th>
                                <th className="px-4 sm:px-8 py-4 font-black">Tier Level</th>
                                <th className="px-4 sm:px-8 py-4 font-black">Status</th>
                                <th className="px-4 sm:px-8 py-4 font-black">Date Joined</th>
                                <th className="px-4 sm:px-8 py-4 font-black text-right">Potential APY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { address: '0x8a2...3b1f', level: 'LEVEL 1', status: 'ACTIVE', color: 'gold-start', date: '2 mins ago', apy: '14.2%' },
                                { address: '0x1c4...e892', level: 'LEVEL 2', status: 'ACTIVE', color: 'silver', date: '1 hour ago', apy: '8.5%' },
                                { address: '0x5f2...a1c9', level: 'LEVEL 3', status: 'INACTIVE', color: 'gray-700', date: '5 hours ago', apy: '--' }
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                                    <td className="px-4 sm:px-8 py-4 lg:py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`size-8 rounded-full bg-gradient-to-br from-${row.color} to-transparent opacity-30 shrink-0`}></div>
                                            <span className="text-xs sm:text-sm font-mono text-silver group-hover:text-white transition-colors">{row.address}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-8 py-4 lg:py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.level === 'LEVEL 1' ? 'bg-gold-start/10 text-gold-start border border-gold-start/20' : 'bg-white/5 text-silver border border-white/10'}`}>
                                            {row.level}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-8 py-4 lg:py-5">
                                        <span className={`flex items-center gap-2 text-[10px] font-bold ${row.status === 'ACTIVE' ? 'text-green-400' : 'text-silver/40'}`}>
                                            <span className={`size-1.5 rounded-full ${row.status === 'ACTIVE' ? 'bg-green-400 animate-pulse' : 'bg-silver/20'}`}></span>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-8 py-4 lg:py-5 text-[10px] sm:text-xs text-silver/60 font-medium">{row.date}</td>
                                    <td className="px-4 sm:px-8 py-4 lg:py-5 text-right font-bold text-white text-xs sm:text-sm">{row.apy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
};

export default ReferralDashboard;
