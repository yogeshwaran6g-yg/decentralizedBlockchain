import React, { useState } from 'react';

const slots = [
    {
        level: 1,
        name: 'Starter Core',
        price: '$50.00',
        active: true,
        dailyROI: '0.5%',
        multiplier: '1.2x',
        networkBonus: '+2%',
        gradientClass: 'from-accent-gold/20 to-transparent',
    },
    {
        level: 2,
        name: 'Node Amplifier',
        price: '$150.00',
        active: true,
        dailyROI: '0.8%',
        multiplier: '1.5x',
        networkBonus: '+5%',
        gradientClass: 'from-accent-gold/30 to-primary',
    },
    {
        level: 3,
        name: 'Yield Prime',
        price: '$500.00',
        active: false,
        dailyROI: '1.2%',
        multiplier: '2.0x',
        networkBonus: '+10%',
        gradientClass: null,
    },
    {
        level: 4,
        name: 'Alpha Hub',
        price: '$1,200.00',
        active: false,
        dailyROI: '1.8%',
        multiplier: '2.8x',
        networkBonus: '+15%',
        gradientClass: null,
    },
    {
        level: 5,
        name: 'Echelon Nexus',
        price: '$3,000.00',
        active: false,
        dailyROI: '2.5%',
        multiplier: '4.0x',
        networkBonus: '+25%',
        gradientClass: null,
    },
    {
        level: 6,
        name: 'Titan Core',
        price: '$7,500.00',
        active: false,
        dailyROI: '3.5%',
        multiplier: '6.5x',
        networkBonus: '+40%',
        gradientClass: null,
    },
    {
        level: 7,
        name: 'Genesis Supreme',
        price: '$15,000.00',
        active: false,
        dailyROI: '5.0%',
        multiplier: '10x',
        networkBonus: '+60%',
        gradientClass: null,
    },
];

const rewardsHistory = [
    {
        id: 1,
        slot: 'Slot 2 - Node Amplifier',
        status: 'Processed',
        date: 'Oct 24, 2023 14:32',
        amount: '+0.045 ETH',
    },
    {
        id: 2,
        slot: 'Slot 1 - Starter Core',
        status: 'Processed',
        date: 'Oct 24, 2023 10:15',
        amount: '+0.012 ETH',
    },
];

const SlotCard = ({ slot, onActivate }) => {
    const { level, name, price, active, dailyROI, multiplier, networkBonus, gradientClass } = slot;

    if (active) {
        return (
            <div className="glass-card rounded-xl p-5 flex flex-col active-gold-glow relative overflow-hidden group">
                {/* Level & Status */}
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] bg-accent-gold text-primary px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                        Level {level}
                    </span>
                    <span className="flex items-center gap-1 text-accent-gold text-xs font-bold">
                        <span className="material-symbols-outlined text-sm">verified</span> Active
                    </span>
                </div>

                {/* Visual Thumbnail */}
                <div className="aspect-video w-full rounded-lg mb-4 bg-primary/50 overflow-hidden border border-white/5">
                    <div className={`w-full h-full bg-gradient-to-br ${gradientClass}`} />
                </div>

                <h3 className="text-xl font-bold mb-1">{name}</h3>
                <p className="text-white/80 font-mono text-lg mb-4">
                    {price} <span className="text-white/40 text-sm">/ Lifetime</span>
                </p>

                {/* Stats */}
                <div className="space-y-2 mb-6 text-sm text-white/60">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Daily ROI</span>
                        <span className="text-white font-medium">{dailyROI}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                        <span>Multiplier</span>
                        <span className="text-white font-medium">{multiplier}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Network Bonus</span>
                        <span className="text-white font-medium">{networkBonus}</span>
                    </div>
                </div>

                <button className="w-full py-3 rounded-lg bg-white/5 text-white font-bold hover:bg-white/10 transition-all border border-white/10 mt-auto">
                    Manage Slot
                </button>
            </div>
        );
    }

    return (
        <div className="glass-card rounded-xl p-5 flex flex-col relative overflow-hidden group hover:border-white/20 transition-all">
            {/* Level & Status */}
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                    Level {level}
                </span>
                <span className="flex items-center gap-1 text-white/40 text-xs font-bold">
                    <span className="material-symbols-outlined text-sm">lock</span> Locked
                </span>
            </div>

            {/* Visual Thumbnail */}
            <div className="aspect-video w-full rounded-lg mb-4 bg-primary/50 overflow-hidden border border-white/5">
                <div className="w-full h-full bg-white/5 grayscale" />
            </div>

            <h3 className="text-xl font-bold mb-1">{name}</h3>
            <p className="text-white/80 font-mono text-lg mb-4">
                {price} <span className="text-white/40 text-sm">/ Lifetime</span>
            </p>

            {/* Stats (locked) */}
            <div className="space-y-2 mb-6 text-sm text-white/40">
                <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Daily ROI</span>
                    <span className="text-white/60 font-medium italic">Unlocks {dailyROI}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>Multiplier</span>
                    <span className="text-white/60 font-medium italic">{multiplier}</span>
                </div>
                <div className="flex justify-between">
                    <span>Network Bonus</span>
                    <span className="text-white/60 font-medium italic">{networkBonus}</span>
                </div>
            </div>

            <button
                onClick={() => onActivate(slot)}
                className="w-full py-3 rounded-lg bg-primary text-white font-bold border border-white/10 mt-auto
                           group-hover:bg-accent-gold group-hover:text-primary group-hover:border-accent-gold
                           transition-all duration-300"
            >
                Activate Now
            </button>
        </div>
    );
};

const SlotActivation = () => {
    const [slotData, setSlotData] = useState(slots);
    const [activatingSlot, setActivatingSlot] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    const activeCount = slotData.filter((s) => s.active).length;

    const handleActivate = (slot) => {
        setActivatingSlot(slot);
        setShowConfirm(true);
    };

    const confirmActivation = () => {
        if (!activatingSlot) return;
        setSlotData((prev) =>
            prev.map((s) => (s.level === activatingSlot.level ? { ...s, active: true } : s))
        );
        setShowConfirm(false);
        setActivatingSlot(null);
    };

    return (
        <div className="space-y-10">
            {/* Hero */}
            <div>
                <h2 className="text-4xl md:text-5xl font-black mb-3 bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent">
                    Slot Activation
                </h2>
                <p className="text-white/50 max-w-2xl leading-relaxed">
                    Unlock high-performance slots to maximize your network yields. Each tier provides
                    compounded rewards and increased ecosystem governance voting power.
                </p>
            </div>

            {/* Progress Tracker */}
            <div className="glass-card rounded-xl p-6 flex flex-wrap items-center justify-between gap-6 border border-accent-gold/20">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-accent-gold">trending_up</span>
                    </div>
                    <div>
                        <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                            Current Multiplier
                        </p>
                        <p className="text-2xl font-black text-white">
                            1.5x{' '}
                            <span className="text-sm text-accent-gold font-medium ml-2">
                                +0.3x next level
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex-1 min-w-[200px] h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent-gold rounded-full"
                        style={{
                            width: `${(activeCount / 7) * 100}%`,
                            boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
                            transition: 'width 0.5s ease',
                        }}
                    />
                </div>
                <div className="text-right">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                        Slots Active
                    </p>
                    <p className="text-2xl font-black text-white">
                        {activeCount} / {slotData.length}
                    </p>
                </div>
            </div>

            {/* Slot Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {slotData.map((slot) => (
                    <SlotCard key={slot.level} slot={slot} onActivate={handleActivate} />
                ))}
            </div>

            {/* Rewards History Table */}
            <div>
                <h3 className="text-2xl font-bold mb-6">Network Rewards History</h3>
                <div className="glass-card rounded-xl overflow-hidden border border-white/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10">
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">
                                        Slot
                                    </th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">
                                        Reward Date
                                    </th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">
                                        Amount
                                    </th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rewardsHistory.map((row) => (
                                    <tr key={row.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold">{row.slot}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block size-2 rounded-full bg-green-500 mr-2" />
                                            <span className="text-sm">{row.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-white/60 text-sm">{row.date}</td>
                                        <td className="px-6 py-4 font-mono text-accent-gold">{row.amount}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-white/40 hover:text-white transition-colors">
                                                <span className="material-symbols-outlined text-lg">
                                                    open_in_new
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && activatingSlot && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => setShowConfirm(false)}
                    />
                    {/* Modal */}
                    <div className="relative glass-card rounded-2xl p-8 max-w-sm w-full mx-4 border border-accent-gold/30 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="size-14 rounded-full bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-accent-gold text-3xl">
                                    bolt
                                </span>
                            </div>
                            <div>
                                <h4 className="text-xl font-black mb-1">Activate Slot?</h4>
                                <p className="text-white/50 text-sm">
                                    You are about to activate{' '}
                                    <span className="text-white font-bold">
                                        Level {activatingSlot.level} – {activatingSlot.name}
                                    </span>{' '}
                                    for{' '}
                                    <span className="text-accent-gold font-bold">
                                        {activatingSlot.price}
                                    </span>
                                    . This is a lifetime purchase.
                                </p>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-3 mt-2">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="py-3 rounded-lg bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmActivation}
                                    className="py-3 rounded-lg staking-button-gold text-primary text-sm font-black transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlotActivation;
