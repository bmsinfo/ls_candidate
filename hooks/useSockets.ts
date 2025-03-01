import logger from "@/lib/logger";
import { useState, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";
interface SocketOptions {
  url: string;
  eventListeners: { [key: string]: (...args: any[]) => void };
  autoReconnect?: boolean; // Optional feature for auto-reconnect
}

export const useSocket = ({
  url,
  eventListeners,
  autoReconnect = false,
}: SocketOptions) => {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const connectSocket = useCallback(() => {
    console.log("connecting socket###", socketRef.current);
    if (!socketRef.current) {
      // Initialize socket connection
      const socket = io(url);

      socketRef.current = socket;

      console.log("connecting after socket###", socketRef.current);

      // Handle connection event
      socket.on("connect", () => {
        setConnected(true);
        console.log("Socket connected with ID:", socket.id);
        logger("Socket connected");
      });

      // Handle disconnection event
      socket.on("disconnect", () => {
        setConnected(false);
        console.log("Socket disconnected");
        logger("disconnect connected");
        disconnectSocket();
      });

      // Register event listeners dynamically
      Object.keys(eventListeners).forEach((event) => {
        socket.on(event, eventListeners[event]);
      });
    }
  }, [url, eventListeners, autoReconnect]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      // Unregister event listeners and disconnect the socket
      Object.keys(eventListeners).forEach((event) => {
        socketRef.current?.off(event);
      });
      socketRef.current?.disconnect();
      socketRef.current = null;
      setConnected(false);
      console.log("Socket connection closed");
    }
  }, [eventListeners, socketRef.current]);

  // TODO: we need to emit the event here and expose this function to the parent component
  const emitEventToSocket = (event: string, data: any) => {
    console.log("#### ccchuuunks ssss #####", {
      socket: socketRef.current,
      event,
      data,
    });
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    connectSocket,
    disconnectSocket,
    socket: socketRef.current,
    connected,
    emitEventToSocket,
  };
};
