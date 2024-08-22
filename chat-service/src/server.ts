import {Server} from 'http';
import app from "./app";
import { connectDB, Message } from './database';
import config from './config/config'
import { Socket,Server as SocketIoServer } from 'socket.io';
let server: Server;

connectDB();

server=app.listen(config.PORT,()=>{
    console.log(`Server is running on port ${config.PORT}`);
})

const io=new SocketIoServer(server);

io.on("connection",(socket:Socket)=>{
    console.log(`client connected with clientId : ${socket.id}`);
    socket.on("disconnect",()=>{
        console.log("Client Disconnected",socket.id);
    })
    socket.on("sendBroadcastMessage", (message) => {
        io.emit("receiveMessage", message);
    });

    socket.on("sendPrivateMessage", async (data) => {
        const { senderId, receiverId, message } = data;
        const msg = new Message({ senderId, receiverId, message });
        await msg.save();

        io.to(receiverId).emit("receiveMessage", msg);
    });
})

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);