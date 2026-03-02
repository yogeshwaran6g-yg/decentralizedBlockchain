import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

const UserManagement = () => {
    const { data: usersData, isLoading, error } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: async () => {
            const response = await fetch('/api/v1/admin/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            return data.data;
        }
    });

    const [activeReferrer, setActiveReferrer] = useState(null);
    const popoverRef = useRef(null);

    const users = usersData || [];

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setActiveReferrer(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex-1 overflow-y-auto bg-background-dark">
            {/* Header Section */}
            <header className="p-4 lg:p-8 pb-0">
                <div className="flex flex-wrap justify-between items-end gap-3 lg:gap-4">
                    <div className="space-y-0.5 lg:space-y-1">
                        <h2 className="text-xl lg:text-3xl font-black tracking-tight">Users</h2>
                        <p className="text-gray-400 text-[10px] lg:text-sm">Monitor protocol participants.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export CSV
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-all shadow-lg shadow-white/5">
                            <span className="material-symbols-outlined text-lg leading-none">person_add</span>
                            Add New User
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-4 lg:mt-8">
                    <div className="glass-card p-4 lg:p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[9px] lg:text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5 lg:mb-1">Total Users</p>
                            <h3 className="text-lg lg:text-2xl font-bold">{users.length.toLocaleString()}</h3>
                            <p className="text-[9px] lg:text-[10px] text-green-400 font-semibold mt-0.5 lg:mt-1">+100% (New System)</p>
                        </div>
                        <div className="size-10 lg:size-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <span className="material-symbols-outlined text-2xl lg:text-3xl">groups</span>
                        </div>
                    </div>
                    <div className="glass-card p-4 lg:p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[9px] lg:text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5 lg:mb-1">Active Users</p>
                            <h3 className="text-lg lg:text-2xl font-bold">{users.filter(u => u.is_active).length.toLocaleString()}</h3>
                            <p className="text-[9px] lg:text-[10px] text-indigo-400 font-semibold mt-0.5 lg:mt-1">{(users.length > 0 ? (users.filter(u => u.is_active).length / users.length * 100).toFixed(1) : 0)}% Activation Rate</p>
                        </div>
                        <div className="size-10 lg:size-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                            <span className="material-symbols-outlined text-2xl lg:text-3xl">token</span>
                        </div>
                    </div>
                    <div className="glass-card p-4 lg:p-6 rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[9px] lg:text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5 lg:mb-1">Blocked Users</p>
                            <h3 className="text-lg lg:text-2xl font-bold">{users.filter(u => u.is_blocked).length.toLocaleString()}</h3>
                            <p className="text-[9px] lg:text-[10px] text-red-400 font-semibold mt-0.5 lg:mt-1">Safety First</p>
                        </div>
                        <div className="size-10 lg:size-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                            <span className="material-symbols-outlined text-2xl lg:text-3xl">block</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filters & Search Toolbar */}
            <section className="p-4 lg:p-6">
                <div className="glass-card rounded-xl p-2 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96 flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-gray-500 pointer-events-none">search</span>
                        <input className="w-full bg-background-dark border border-white/5 focus:border-yellow-400/50 focus:ring-0 rounded-lg pl-12 py-2.5 text-sm text-gray-200 placeholder-gray-500" placeholder="Search by wallet address (0x...)" type="text" />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-background-dark border border-white/5 px-3 py-1.5 rounded-lg">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">NFT Status</span>
                            <select className="bg-transparent border-none focus:ring-0 text-xs font-semibold p-0 cursor-pointer">
                                <option className="bg-background-dark">All Assets</option>
                                <option className="bg-background-dark">Active</option>
                                <option className="bg-background-dark">None</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-background-dark border border-white/5 px-3 py-1.5 rounded-lg">
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Account Status</span>
                            <select className="bg-transparent border-none focus:ring-0 text-xs font-semibold p-0 cursor-pointer">
                                <option className="bg-background-dark">Any</option>
                                <option className="bg-background-dark">Active</option>
                                <option className="bg-background-dark">Suspended</option>
                            </select>
                        </div>
                        <button className="size-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                            <span className="material-symbols-outlined text-gray-400">filter_list</span>
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="mt-6 glass-card rounded-xl overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-white/[0.02] border-b border-white/5">
                                <tr>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">Address</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">Username</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">Slot</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">XP</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">Reg Date</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="size-8 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></div>
                                                <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Loading Users...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-20 text-center">
                                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">No Users Found</p>
                                        </td>
                                    </tr>
                                ) : users.map((user) => (
                                    <tr key={user.id} className="table-row-hover transition-colors">
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <div className="flex items-center gap-2 group">
                                                <span className={`font-mono text-xs lg:text-sm ${user.is_blocked ? 'text-gray-500' : 'text-gray-300'}`}>
                                                    {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <span className="text-xs lg:text-sm text-gray-400">{user.username || 'Anon User'}</span>
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <span className={`text-xs lg:text-sm font-semibold ${user.is_blocked ? 'text-gray-500' : 'text-yellow-400'}`}>Level {user.level || 1}</span>
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            <span className={`text-xs lg:text-sm font-bold ${user.is_blocked ? 'text-gray-500' : 'text-gray-300'}`}>{(user.total_xp || 0).toLocaleString()} XP</span>
                                        </td>
                                        <td className={`px-4 lg:px-6 py-3 lg:py-4 text-[10px] lg:text-sm ${user.is_blocked ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4">
                                            {user.is_blocked ? (
                                                <span className="px-2 py-0.5 lg:px-2.5 lg:py-1 rounded border border-red-500/20 bg-red-500/10 text-red-400 text-[8px] lg:text-[10px] font-bold uppercase">Blocked</span>
                                            ) : (
                                                <span className="px-2 py-0.5 lg:px-2.5 lg:py-1 rounded border border-green-500/20 bg-green-500/10 text-green-400 text-[8px] lg:text-[10px] font-bold uppercase">Active</span>
                                            )}
                                        </td>
                                        <td className="px-4 lg:px-6 py-3 lg:py-4 text-right relative">
                                            <button
                                                onClick={() => setActiveReferrer(activeReferrer === user.id ? null : user.id)}
                                                className="material-symbols-outlined text-gray-500 hover:text-white transition-colors text-lg lg:text-2xl"
                                            >
                                                more_vert
                                            </button>

                                            {activeReferrer === user.id && (
                                                <div
                                                    ref={popoverRef}
                                                    className="absolute right-0 mt-2 w-64 glass-card bg-background-dark/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl z-50 text-left animate-in fade-in zoom-in duration-200"
                                                >
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Referral Information</p>
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-[10px] text-gray-400 mb-1 font-medium">Referred By</p>
                                                            {user.referred_by_address ? (
                                                                <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                                                                    <span className="material-symbols-outlined text-yellow-400 text-sm">link</span>
                                                                    <span className="font-mono text-xs text-gray-200">
                                                                        {user.referred_by_address.slice(0, 10)}...{user.referred_by_address.slice(-8)}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-gray-500 italic px-2">No referrer (Organic)</p>
                                                            )}
                                                        </div>
                                                        <div className="pt-2 border-t border-white/5">
                                                            <button className="w-full py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                                                                <span className="material-symbols-outlined text-sm">visibility</span>
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 lg:px-6 py-3 lg:py-4 flex flex-col sm:flex-row items-center justify-between gap-2 bg-white/[0.01] border-t border-white/5">
                        <p className="text-[10px] lg:text-xs text-gray-500 font-medium">Showing {users.length} of {users.length} users</p>
                        <div className="flex gap-1 lg:gap-2">
                            <button className="size-7 lg:size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-500 hover:text-white transition-colors disabled:opacity-30" disabled>
                                <span className="material-symbols-outlined text-base lg:text-lg">chevron_left</span>
                            </button>
                            <div className="flex items-center gap-0.5 lg:gap-1">
                                <button className="size-7 lg:size-8 rounded bg-yellow-400 text-[10px] lg:text-xs font-bold text-black">1</button>
                            </div>
                            <button className="size-7 lg:size-8 flex items-center justify-center rounded border border-white/5 bg-white/5 text-gray-400 hover:text-white transition-colors disabled:opacity-30" disabled>
                                <span className="material-symbols-outlined text-base lg:text-lg">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Context Footer */}
            <footer className="mt-auto p-4 lg:p-6 border-t border-white/5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 opacity-50">
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
                        <a className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Terms of Service</a>
                        <a className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">Privacy Protocol</a>
                        <a className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors" href="#">API Docs</a>
                    </div>
                    <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">© 2024 Web3 Foundation Admin</p>
                </div>
            </footer>
        </div>
    );
};

export default UserManagement;
