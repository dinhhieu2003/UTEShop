import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { initWebSocket } from "./services/notification/notification";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 6969;

// HTTP & WebSocket Server
const server = createServer(app);
const wss = new WebSocketServer({ server });
initWebSocket(wss);

// Mongoose connection
const password_db = process.env.PASSWORD_MONGODB;
const MONGO_URL = `mongodb+srv://vuongdinhhieu2003:${password_db}@cluster0.u5toxop.mongodb.net/UTEShop?retryWrites=true&w=majority`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

// Routes
import authRouter from "./routes/auth/index";
import cartRouter from "./routes/cart/index";
import productRouter from "./routes/product/index";
import categoryRouter from "./routes/category/index";
import userRouter from "./routes/user/index";
import orderRouter from "./routes/order/index";
import couponRouter from "./routes/coupon/index";
import adminRouter from "./routes/admin/index";

app.use("/api/v1/auth", authRouter());
app.use("/api/v1/carts", cartRouter());
app.use("/api/v1/products", productRouter());
app.use("/api/v1/categories", categoryRouter());
app.use("/api/v1/users", userRouter());
app.use("/api/v1/orders", orderRouter());
app.use("/api/v1/coupons", couponRouter());
app.use("/api/v1/admin", adminRouter());

// Listen server
server.listen(port, () => {
    console.log(`Server running on ${port}`);
});
