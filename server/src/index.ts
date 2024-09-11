import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import registerRouter from './routes/registerRoute' 
dotenv.config();
import loginRoute from './routes/loginRoute';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let port = process.env.PORT || 6969;

app.listen(port, () => {
    //callback
    console.log("Backend Nodejs is runing on the port : " + port)
})

const password_db = process.env.PASSWORD_MONGODB;
const MONGO_URL = `mongodb+srv://vuongdinhhieu2003:${password_db}@cluster0.u5toxop.mongodb.net/UTEShop?retryWrites=true&w=majority`;

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use("/api/v1/auth/login", loginRoute());
app.use(registerRouter)

// middleware for all
// app.use(middleware.commonLog);