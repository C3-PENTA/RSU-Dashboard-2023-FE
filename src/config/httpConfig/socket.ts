import { io } from 'socket.io-client';

const APP_ENV = import.meta.env.VITE_APP_ENV;
let SOCKET_URL = '';

if (APP_ENV === 'PROD') {
  SOCKET_URL = `${location.protocol}//${location.hostname}${
    location.port ? `:${location.port}` : ''
  }/`;
} else {
  SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
}

export const socket = io(SOCKET_URL);

export enum SocketEvents {
  NEW_NOTIFICATION = 'notification',
  KEEP_ALIVE = 'keep-alive',
}
