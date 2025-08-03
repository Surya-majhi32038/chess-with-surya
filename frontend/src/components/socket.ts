// src/socket.ts
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_URL, {
  autoConnect: false, // this is very important
});

export default socket;
