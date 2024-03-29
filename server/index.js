const express = require("express");
const dotenv = require("dotenv");
const { auth } = require("express-openid-connect");
const authMiddleware = require("./middleware/authMiddleware.js");
const routes = require("./routes/Routes.js");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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
app.use(express.json());
app.use(cors());

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
