import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Mock Data Store (In-memory for session)
let mockDonors = [
    { id: '1', name: 'Ramesh Gupta', bloodGroup: 'O+', phone: '+919876543210', whatsapp: '+919876543210', city: 'Mumbai', active: true, lastDonationDate: { toDate: () => new Date('2023-10-15') }, createdAt: new Date() },
    { id: '2', name: 'Sita Verma', bloodGroup: 'A+', phone: '+919876543211', whatsapp: '+919876543211', city: 'Delhi', active: true, lastDonationDate: { toDate: () => new Date('2024-01-10') }, createdAt: new Date() },
    { id: '3', name: 'John Doe', bloodGroup: 'B-', phone: '+919876543212', whatsapp: '', city: 'Bangalore', active: false, lastDonationDate: null, createdAt: new Date() }
];

const listeners = [];

const notifyListeners = () => {
    listeners.forEach(cb => cb([...mockDonors]));
};

export const donorService = {
    subscribeToAllDonors: (callback, onError) => {
        // Mock Implementation
        console.log("Subscribing to mock donors...");
        listeners.push(callback);
        callback([...mockDonors]);

        // Return unsubscribe function
        return () => {
            const index = listeners.indexOf(callback);
            if (index > -1) listeners.splice(index, 1);
        };
    },

    createDonor: async (data) => {
        console.log("Creating mock donor:", data);
        const newDonor = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date(),
            lastDonationDate: data.lastDonationDate ? { toDate: () => new Date(data.lastDonationDate) } : null
        };
        mockDonors = [newDonor, ...mockDonors];
        notifyListeners();
        return Promise.resolve(newDonor.id);
    },

    updateDonor: async (id, data) => {
        console.log("Updating mock donor:", id, data);
        mockDonors = mockDonors.map(d => d.id === id ? { ...d, ...data, lastDonationDate: data.lastDonationDate ? { toDate: () => new Date(data.lastDonationDate) } : null } : d);
        notifyListeners();
        return Promise.resolve();
    },

    deleteDonor: async (id) => {
        console.log("Deleting mock donor:", id);
        mockDonors = mockDonors.filter(d => d.id !== id);
        notifyListeners();
        return Promise.resolve();
    },

    toggleStatus: async (id, currentStatus) => {
        console.log("Toggling status:", id, !currentStatus);
        mockDonors = mockDonors.map(d => d.id === id ? { ...d, active: !currentStatus } : d);
        notifyListeners();
        return Promise.resolve();
    }
};
