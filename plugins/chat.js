// plugins/socket.io.js
import { io } from 'socket.io-client';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
    // Initialize Socket.IO client with server URL
    const socket = io('http://localhost:3001');
    console.log(socket)
    // Inject the socket instance into the app
    nuxtApp.provide('socket', socket);

    // Log connection status
    socket.on('connect', () => {
        console.log('Socket.IO connected');
    });

    // Log disconnection status
    socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
    });

    // Error handling
    socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error.message);
    });
});
