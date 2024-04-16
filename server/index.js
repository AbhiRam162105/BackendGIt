const express = require("express");
const dotenv = require("dotenv");
const { auth } = require("express-openid-connect");
const authMiddleware = require("./middleware/authMiddleware.js");
const routes = require("./routes/Routes.js");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Issue = require("./models/issues.js");
const http = require("http");
const { Server } = require("socket.io");
const { fetchAllUserIssues } = require("./controllers/issueControllers.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: "http://localhost:3000",
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: "https://dev-z8tivme55voqva1b.us.auth0.com",
};

app.use(cors({ origin: "*" }));

app.use("/", routes);

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const db = mongoose.connection;

db.once("open", async () => {
  console.log("Connected to MongoDB");
  const issuesInitial = await Issue.find({});
  io.emit("Connected", issuesInitial);
  const changeStream = Issue.watch();
  changeStream.on("change", async (change) => {
    console.log("Change detected:", change);
    console.log("====================================");
    console.log(change.fullDocument._id.toString());
    console.log("====================================");
    // Fetch all issues from the database
    const issues = await Issue.find({});
    // Emit the fetched issues to all connected clients
    io.emit("issueUpdate", issues);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
