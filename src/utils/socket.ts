import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { store } from "../redux/store";

const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  let { accessToken } = store.getState().auth;
  useEffect(() => {
    const newSocket = io("http://localhost:3003", {
      auth: {
        Authorization: `Bearer ${accessToken}`,
      },
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket server with ID:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [accessToken]);

  return socket;
};

export default useSocket;
