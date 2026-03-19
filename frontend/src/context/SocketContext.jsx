import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Determine the socket URL based on environment
    // If we're in Vite dev mode (port 5173), point to Flask (port 5000)
    // In production, they are on the same origin.
    const socketUrl = window.location.port === '5173' 
      ? 'http://localhost:5000' 
      : window.location.origin;

    console.log(`DEBUG: Connecting socket to ${socketUrl}`);

    const newSocket = io(socketUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    newSocket.on('connect', () => {
      console.log('Socket.io connected (Real-time update active)');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.io disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
