import express from "express";
import apiRoute, { apiProtected } from "./routes/api.js";
import Mongoose from "mongoose";
import { DB_CONNECT } from "./utils/constants.js";
import AuthMiddleware from "./middlewares/AuthMiddleware.js";
const app = express();

Mongoose.connect(DB_CONNECT,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const PORT = 8000;

app.use(express.json());
app.use('/api/',apiRoute);
app.use('/api/',AuthMiddleware,apiProtected);

app.listen(PORT,()=> {
    console.log("Server Started");
})
