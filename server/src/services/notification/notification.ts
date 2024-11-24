import { WebSocketServer, WebSocket } from "ws";

interface Client extends WebSocket {
    email?: string;
}

const clients: Set<Client> = new Set();

/**
 * Khởi tạo WebSocket Server
 * @param wss WebSocketServer instance
 */
export const initWebSocket = (wss: WebSocketServer) => {
    wss.on("connection", async(ws: Client, req) => {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const email = url.searchParams.get('email') || "anonymous";
        ws.email = email;
        clients.add(ws);
        console.log(`User connected: ${email}`);

        ws.on("close", () => {
            clients.delete(ws);
            console.log(`User disconnected: ${email}`);
        });

        ws.on("message", (message) => {
            console.log(`Message received from ${email}: ${message}`);
        });
    });
};

/**
 * Gửi thông báo tới các client qua WebSocket
 * @param targetId (Tùy chọn) ID của người nhận (gửi tất cả nếu không truyền)
 * @param message Nội dung thông báo
 */
export const broadcast = (targetId: string | null, message: any) => {
    console.log("Broadcasting....");
    console.log("Message: ", message.payload);
    const serializedMessage = JSON.stringify(message);
    clients.forEach((client) => {
        if (
            client.readyState !== WebSocket.CLOSED &&
            (!targetId || client.email === targetId)
        ) {
            client.send(serializedMessage);
        }
    });
};
