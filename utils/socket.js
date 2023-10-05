import { io } from 'socket.io-client';

// const URL = process.env.WEBSOCKET_URL;
const URL = 'http://13.250.57.155:5000/';

export const socket = io(URL, { autoConnect: false });
