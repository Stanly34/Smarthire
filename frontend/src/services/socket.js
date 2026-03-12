import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = (token) => {
  if (socket) socket.disconnect();
  const serverUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : '/';
  socket = io(serverUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
