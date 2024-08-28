const express = require("express");
const cors = require("cors");
require("dotenv").config()
const connectDB = require("./config/connectDB")
const router = require("./routes/index")
const cookieParser = require("cookie-parser")
const { app, server } = require("./socket/index")

// CORS helps to prevent malicious websites from accessing sensitive information on your server. 
// Resource Sharing: It allows controlled access to resources on a server from a different origin, 
// enabling web applications to make API requests to external services
// const app = express();
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials: true,
}))

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.json({
        message: "Server running"
    })
})

//api endpoints
app.use("/api", router)


connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server running at ${PORT}`)
    })
})

