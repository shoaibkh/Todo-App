import { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import useTasksRealtime from '../hooks/useTasksRealtime';
import { Task, User } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useContext(AuthContext);
    console.log('user', user);
    useTasksRealtime();
    const qc = useQueryClient();

    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
        }
    }, [user]);


    const { data: tasks = [], isLoading } = useQuery<Task[]>({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await api.get('/tasks');
            return res.data;
        },
    });

    const { data: users = [] } = useQuery<User[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await api.get('/users');
            return res.data;
        },
    });


    const createTask = useMutation({
        mutationFn: async (payload: { title: string; description?: string }) => {
            const response = await api.post('/tasks', payload);
            return response.data;
        },
        onSuccess: async () => {
            await qc.invalidateQueries({
                queryKey: ['tasks'],
            });
        },
    });


    const updateTask = useMutation({
        mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.put(`/tasks/${id}`, payload),
        onSuccess: async () => await qc.invalidateQueries({ queryKey: ['tasks'] }),
    });


    const assignTask = useMutation({
        mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
            const response = await api.put(`/tasks/${id}/assign/${userId}`);
            return response.data;
        },
        onSuccess: async () => await qc.invalidateQueries({ queryKey: ['tasks'] }),
    });

    //delete task
    const deleteTask = useMutation({
        mutationFn: async (id: string) => api.delete(`/tasks/${id}`),
        onSuccess: async () => await qc.invalidateQueries({ queryKey: ['tasks'] }),
    });

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Tasks</h2>
                        {user?.roles?.includes('Admin') && <CreateTaskForm onCreate={(payload) => createTask.mutate(payload)} />}
                    </div>


                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {tasks.map((task) => (
                                <div key={task.id} className="bg-white p-4 rounded shadow">
                                    <h3 className="font-semibold">{task.title}</h3>
                                    <p className="text-sm text-gray-600">{task.description}</p>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="text-xs">Status: {task.status}</div>
                                        <div className="flex items-center gap-2">
                                            {user?.roles?.includes('User') && task.assignedToId === user.id &&
                                                <select className="border p-1 rounded text-sm" value={task.status} onChange={(e) => updateTask.mutate({ id: task.id, payload: { status: e.target.value } })}>
                                                    <option value="OPEN">OPEN</option>
                                                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                                                    <option value="DONE">DONE</option>
                                                </select>
                                            }
                                            {user?.roles?.includes('Admin') && (
                                                <>
                                                    <select
                                                        className="border p-1 rounded text-sm"
                                                        value={task.assignedToId || ''}
                                                        onChange={(e) => assignTask.mutate({ id: task.id, userId: e.target.value })}
                                                    >
                                                        <option value="">Unassigned</option>
                                                        {users.map((u) => (
                                                            <option key={u.id} value={u.id}>
                                                                {u.email}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => deleteTask.mutate(task.id)}>
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <aside className="w-full md:w-80">
                    <div className="bg-white p-4 rounded shadow">
                        <h4 className="font-semibold mb-2">Users</h4>
                        <ul className="space-y-2">
                            {users.map((u) => (
                                <li key={u.id} className="text-sm">
                                    {u.email} <span className="text-xs text-gray-500">{u.roles.join(',')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>


                    <div className="bg-white p-4 rounded shadow mt-4">
                        <h4 className="font-semibold mb-2">My Info</h4>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="font-semibold">{user.fullName}</div>
                                    <div className="text-sm">{user.email}</div>
                                    <div className="text-xs text-gray-500">Roles: {user.roles.join(',')}</div>
                                </div>
                                <Link href="/updateProfile">
                                    <p className="text-sm bg-blue-600 text-white px-3 py-1 rounded">Update</p>
                                </Link>
                            </div>
                        ) : (
                            <div>Not logged in</div>
                        )}
                    </div>
                </aside>
            </div>
        </Layout>
    );

}


function CreateTaskForm({ onCreate }: { onCreate: (payload: { title: string; description?: string }) => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    async function submit() {
        await onCreate({ title, description });
        setTitle('');
        setDescription('');
        setOpen(false);
    }


    return (
        <div>
            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => setOpen((v) => !v)}>
                New Task
            </button>
            {open && (
                <div className="mt-2 bg-white p-4 rounded shadow">
                    <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="w-full border p-2 rounded mb-2" />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full border p-2 rounded mb-2"></textarea>
                    <div className="flex gap-2">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={submit}>
                            Create
                        </button>
                        <button className="px-3 py-1 rounded border" onClick={() => setOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}