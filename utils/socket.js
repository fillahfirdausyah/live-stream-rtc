import { io } from 'socket.io-client';

// const URL = process.env.WEBSOCKET_URL;
const URL = 'http://54.254.186.51:5000/';

export const socket = io(URL, { autoConnect: false });
