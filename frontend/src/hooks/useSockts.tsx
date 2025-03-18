import { useEffect, useState } from 'react'

// WebSocket URL
const WS_URL = "ws://localhost:8080"

export const useSockts = () => {
    // State to hold the WebSocket instance
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        // Create a new WebSocket connection
        const ws = new WebSocket(WS_URL);

        // Set the WebSocket instance when the connection is opened
        ws.onopen = () => {
            setSocket(ws);
        }

        // Set the WebSocket instance to null when the connection is closed
        ws.onclose = () => {
            setSocket(null);
        }

        // Cleanup function to close the WebSocket connection
        return () => {
            ws.close();
        }
    }, []);

    // Return the WebSocket instance
    return socket;
}
