const express = require("express");
const dotenv = require("dotenv");
const { auth } = require("express-openid-connect");
const authMiddleware = require("./middleware/authMiddleware.js");
const routes = require("./routes/Routes.js");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Issue = require("./models/issues.js");
const io = require("socket.io")(process.env.SOCKET_IO_PORT);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());
// MongoDB connection
const mongoURI = process.env.MONGO_URI; // Ensure you have this in your .env file
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const db = mongoose.connection;

db.once("open", () => {
  console.log("Connected to MongoDB");

  const changeStream = Issue.watch();

  changeStream.on("change", (change) => {
    console.log("Change detected:", change);
    console.log("====================================");
    console.log(change.fullDocument._id.toString());
    console.log("====================================");
    io.emit("issueUpdate", change.fullDocument);
  });
});
