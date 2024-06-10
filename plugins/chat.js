import { io } from 'socket.io-client';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    const runtimeConfig = useRuntimeConfig();
    const serverUrl = runtimeConfig.public.serverUrl;

    console.log('Connecting to server:', serverUrl);

    const socket = io(serverUrl, {
        transports: ['websocket', 'polling'], // Use WebSocket and fallback to polling
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
    });

    nuxtApp.provide('socket', socket);

    socket.on('connect', () => {
        console.log('Socket.IO connected');
    });

    socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
    });

    socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error.message);
    });
});
