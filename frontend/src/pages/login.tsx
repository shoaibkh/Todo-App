import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import api from '../lib/api';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/router';


export default function LoginPage() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await api.post('/users/login', { email, password });
            const token = res.data.access_token;
            login(token);
            router.push('/');
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Login failed');
        }
    }


    return (
        <Layout>
            <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
                <h1 className="text-2xl mb-4">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm">Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" />
                    </div>
                    <div>
                        <label className="block text-sm">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" />
                    </div>
                    {error && <div className="text-red-500">{error}</div>}
                    <div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
                    </div>
                    <div>
                        <p>Don&apos;t have an account?</p>
                    </div>
                    <div>
                        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => router.push('/register')}>
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}