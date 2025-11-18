import { useEffect } from 'react';
import { getSocket } from '../lib/socket';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { Task } from '../types';


export default function useTasksRealtime() {
    const qc = useQueryClient();


    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;


        const onAssigned = (task: Task) => {
            // update tasks list
            qc.setQueryData<Task[]>(['tasks'], (old = []) => {
                const exists = old.find((t) => t.id === task.id);
                if (exists) return old.map((t) => (t.id === task.id ? task : t));
                return [task, ...old];
            });
        };


        const onUpdated = (task: Task) => {
            qc.setQueryData<Task[]>(['tasks'], (old = []) => old.map((t) => (t.id === task.id ? task : t)));
        };


        socket.on('taskAssigned', onAssigned);
        socket.on('taskUpdated', onUpdated);


        return () => {
            socket.off('taskAssigned', onAssigned);
            socket.off('taskUpdated', onUpdated);
        };
    }, [qc]);
}