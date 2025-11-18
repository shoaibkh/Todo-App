import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';
import { decodeToken } from '../lib/jwt';
import { initSocket, disconnectSocket } from '../lib/socket';


interface AuthContextValue {
    user: User | null;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}


export const AuthContext = createContext<AuthContextValue>({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
});


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => (typeof window !== 'undefined' ? localStorage.getItem('token') : null));
    const [user, setUser] = useState<User | null>(null);


    useEffect(() => {
        if (token) {
            const decoded = decodeToken<any>(token);
            if (decoded) {
                // decoded expected to have { sub, email, roles }
                const u: User = { id: decoded.sub, email: decoded.email, roles: decoded.roles || ['User'], fullName: decoded.fullName };
                setUser(u);
                // init socket and join user room
                const s = initSocket(token);
                s.on('connect', () => {
                    s.emit('join', `user:${u.id}`);
                });
            } else {
                setUser(null);
            }
        } else {
            setUser(null);
            disconnectSocket();
        }
    }, [token]);


    const login = (t: string) => {
        localStorage.setItem('token', t);
        setToken(t);
    };


    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };


    return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
};