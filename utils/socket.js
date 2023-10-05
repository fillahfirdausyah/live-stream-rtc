import { io } from 'socket.io-client';

// const URL = process.env.WEBSOCKET_URL;
const URL = 'https://live-stream-rtc-backend.vercel.app/';

export const socket = io(URL, { autoConnect: false });
