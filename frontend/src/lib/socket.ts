import { io, Socket } from 'socket.io-client';


let socket: Socket | null = null;


export function initSocket(token?: string) {
    if (socket) return socket;
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000';
    socket = io(base + '/tasks', {
        auth: {
            token,
        },
        transports: ['websocket'],
    });
    return socket;
}


export function getSocket() {
    return socket;
}


export function disconnectSocket() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}