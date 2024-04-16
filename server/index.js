const express = require("express");
const dotenv = require("dotenv");
const { auth } = require("express-openid-connect");
const authMiddleware = require("./middleware/authMiddleware.js");
const routes = require("./routes/Routes.js");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Issue = require("./models/issues.js");
const Repository = require("./models/repoModel.js"); // Ensure this path is correct
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  const userID = socket.handshake.query.userID;

  socket.on("fetchIssues", async () => {
    const issues = await fetchIssuesForUser(userID);
    socket.emit("issueUpdate", issues);
  });

  socket.on("issueUpdate", async () => {
    const issues = await fetchIssuesForUser(userID);
    socket.emit("issueUpdate", issues);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

async function fetchIssuesForUser(userID) {
  const repositories = await Repository.find({
    owner: mongoose.Types.ObjectId(userID),
  });
  const issueIds = repositories.flatMap((repo) => repo.issues);
  const issues = await Issue.find({ _id: { $in: issueIds } });
  return issues;
}

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
