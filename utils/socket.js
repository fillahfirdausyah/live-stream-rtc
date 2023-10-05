import { io } from 'socket.io-client';

const URL = process.env.WEBSOCKET_URL;

export const socket = io(URL, { autoConnect: false });
