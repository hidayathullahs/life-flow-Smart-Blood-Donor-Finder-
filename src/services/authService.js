import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';

// Mock User for Dev/Fallback
let mockUser = null;
const observers = [];

const notifyObservers = (user) => {
    observers.forEach(callback => callback(user));
};

export const authService = {
    login: async (email, password) => {
        console.log("AUTH SERVICE LOGIN:", email, password); // DEBUG
        // Mock Login Bypass
        if (email.trim() === 'admin@lifeflow.com' && password.trim() === 'halluth123BAJARs') {
            console.log("MOCK LOGIN SUCCESS"); // DEBUG
            mockUser = {
                uid: 'mock-admin-123',
                email: 'admin@lifeflow.com',
                displayName: 'Admin User',
                emailVerified: true,
                role: 'admin'
            };
            notifyObservers(mockUser);
            return Promise.resolve(mockUser);
        }
        return signInWithEmailAndPassword(auth, email, password);
    },
    logout: async () => {
        if (mockUser) {
            mockUser = null;
            notifyObservers(null);
            return Promise.resolve();
        }
        return signOut(auth);
    },
    resetPassword: (email) => {
        if (email === 'admin@lifeflow.com') {
            return Promise.resolve(); // Mock success for admin
        }
        return sendPasswordResetEmail(auth, email);
    },
    subscribe: (callback) => {
        observers.push(callback);
        // If mock user exists, trigger immediately
        if (mockUser) callback(mockUser);

        // Also subscribe to real Firebase Auth
        return onAuthStateChanged(auth, (user) => {
            if (!mockUser) {
                callback(user);
            }
        });
    }
};
