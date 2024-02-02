import express from "express"
import newsRouter from "./routes/userRoute.js"
import newsFetchRouter from "./routes/newsRoute.js"
import authRouter from "./routes/authRoute.js"

import { config } from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"


export const app = express();
config({
    path: "./data/config.env",
})

//using middlewear
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:[process.env.FRONTEND_URI],
    credentials:true
}))


app.use("/user",newsRouter)
app.use("/",newsFetchRouter)
app.use("/user",authRouter)

// app.use("/news",newsRouter)
app.get("/", (req, res) => {
    res.send("Nice working");
})
