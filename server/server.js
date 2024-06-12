// server.js
require("dotenv").config()
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const todo = require("./routes/todo");
const user = require("./routes/user")
const { verifyToken } = require("./controllers/todo")

const app = express();
connectDB();

app.use(cors({ origin: true, credentials: true })); // added
app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("Server up and running"));

// use routes
app.use("/api/user", user);
app.use(verifyToken);
app.use("/api/todo", todo);
// setting up port
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});