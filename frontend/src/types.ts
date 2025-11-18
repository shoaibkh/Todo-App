export type Role = 'Admin' | 'User';


export interface User {
    id: string;
    email: string;
    fullName?: string;
    roles: Role[];
}


export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE';


export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    assignedToId?: string | null;
    assignedTo?: User | null;
    createdAt?: string;
    updatedAt?: string;
}