const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")
require("dotenv").config({ path: "./.env" })

const app = express()
app.use(cors({
    origin: true,
    // origin: process.env.NODE_ENV === "development"  // jar developemt madhe asel tr local port varti run hoil 
    //     ? process.env.LOCAL_SERVER                  // http://localhost:5173
    //     : process.env.LIVE_SERVER,                  // https://live-url.vercel.app // https://live-url.onrender.com
    credentials: true
}))

app.use(cookieParser())
app.use(express.json())
app.use(express.static("dist"))

app.use('/api/v1/auth', require('./routes/auth.routes'))
app.use('/api/v1/admin', require('./routes/admin.routes'))
app.use('/api/v1/payment', require('./routes/payment.routes'))
app.use('/api/v1/landlord', require('./routes/landlord.routes'))
app.use('/api/v1/user', require('./routes/user.routes'))
app.use('/api/v1/premium', require('./routes/premium.routes'))

app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
    // res.status(404).json({ message: "Resource Not Found" })
})
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).json({ message: "SERVER ERROR", error: err.message })
})
mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("MONGO CONNECTED🔗")
    app.listen(process.env.PORT, console.log("SERVER RUNNING 🏃‍♂️"))
})