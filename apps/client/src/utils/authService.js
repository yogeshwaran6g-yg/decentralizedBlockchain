import { ethers } from 'ethers';

const API_BASE_URL = 'http://localhost:5000/api/users'; // Adjust based on your server config

export const authService = {
    async connectWallet() {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed');
        }
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
    },

    async getNonce(address) {
        const response = await fetch(`${API_BASE_URL}/auth/nonce`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address }),
        });
        if (!response.ok) throw new Error('Failed to get nonce');
        const data = await response.json();
        return data.nonce;
    },

    async verifySignature(address, signature) {
        const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address, signature }),
        });
        if (!response.ok) throw new Error('Verification failed');
        const data = await response.json();
        return data; // Returns { token, user }
    },

    async login() {
        try {
            const address = await this.connectWallet();
            const nonce = await this.getNonce(address);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const message = `Sign this message to authenticate: ${nonce}`;
            const signature = await signer.signMessage(message);

            const authData = await this.verifySignature(address, signature);

            // Store token and user data
            localStorage.setItem('authToken', authData.token);
            localStorage.setItem('user', JSON.stringify(authData.user));

            return authData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },

    isLoggedIn() {
        return !!localStorage.getItem('authToken');
    },

    getAuthHeader() {
        const token = localStorage.getItem('authToken');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};
