import { io } from 'socket.io-client';

export const socket = io(import.meta.env.VITE_SOCKET_URI);

export enum SocketEvents {
  NEW_NOTIFICATION = 'notification',
  KEEP_ALIVE = 'keep-alive',
}
