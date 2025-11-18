import React from 'react';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useContext(AuthContext);
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/">
                        <p className="font-bold">Task Dashboard</p>
                    </Link>
                    <nav className="flex items-center gap-4">
                        {user ? (
                            <>
                                <span className="text-sm">{user.email}</span>
                                <button
                                    onClick={() => logout()}
                                    className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link href="/login">
                                <p className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Login</p>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>


            <main className="container mx-auto px-4 py-6">{children}</main>
        </div>
    );
}