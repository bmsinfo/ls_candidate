'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';

import io, { Socket } from 'socket.io-client';

import { SOCKET_URL } from '@/lib/constants';
import logger, { loggerAPI } from '@/lib/logger';
import { isOnLine } from '@/lib/utils';

interface SocketContextProps {
  socket: Socket | null;
  connected: boolean;
  connectSocket: () => void;
  emitEvent: (event: string, data?: any) => void;
  disconnectSocket: () => void;
  socketConnectCounter: number;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocketProvider = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketProvider must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const socketConnectCounterRef = useRef(0);

  const handleSocketEvents = useCallback(
    (socket: Socket) => {
      socket.on('connect', () => {
        logger('Socket connected', { socketId: socket.id });
        console.log('### socket connected ###');
        setConnected(true);
        socketRef.current = socket; // Update the ref with the new socket instance especially in case of re-connect
        socketConnectCounterRef.current++;

        loggerAPI({
          event: 'socket',
          status: 'connected',
          message: 'Socket connected',
        });
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected', { reason });
        setConnected(false);

        if (isOnLine()) {
          loggerAPI({
            event: 'socket',
            status: 'disconnected',
            message: 'Socket disconnected',
            reason: reason,
          });
        }

        // TODO: in future remove 'io client disconnect' as it is not a real disconnect
        if (
          reason === 'io server disconnect' ||
          reason === 'transport close' ||
          reason === 'transport error'
        ) {
          if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
          }
          setTimeout(() => {
            // socket.connect();
            connectSocket();
          }, 2000);
        }
      });

      socket.io.on('reconnect', (attempt) => {
        logger('Socket reconnected', { attempt });
        loggerAPI({
          event: 'socket',
          status: 'reconnected',
          message: 'Socket reconnected',
          reason: attempt + '',
        });
      });

      socket.io.on('reconnect_attempt', (attempt) => {
        logger('Socket reconnection attempt', { attempt });
        loggerAPI({
          event: 'socket',
          status: 'reconnection attempt',
          message: 'reconnection attempt',
          reason: attempt + '',
        });
      });

      socket.io.on('reconnect_error', (error) => {
        console.log('Socket reconnection error', { error });
      });

      socket.io.on('reconnect_failed', () => {
        console.log('Socket reconnection failed');
      });

      socket.io.on('error', (error) => {
        console.log('Socket error', { error });
        loggerAPI({
          event: 'socket',
          status: 'error',
          message: 'Socket error',
          reason: error + '',
        });
      });
    },
    [socketRef, connected],
  );

  const connectSocket = useCallback(() => {
    if (socketRef.current) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socketRef.current = socket;
    handleSocketEvents(socket);
  }, [handleSocketEvents, socketRef.current]);

  const emitEvent = useCallback(
    (event: string, data: any) => {
      if (socketRef.current) {
        // console.log("Emitting event", { event, data });
        socketRef.current.emit(event, data);
      } else {
        console.log('Socket is not connected');
      }
    },
    [socketRef.current],
  );

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      setConnected(false);
      socketRef.current = null;
      logger('Socket disconnected manually');
    }
  }, [socketRef.current]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        connectSocket,
        emitEvent,
        disconnectSocket,
        socketConnectCounter: socketConnectCounterRef.current,
      }}>
      {children}
    </SocketContext.Provider>
  );
};
