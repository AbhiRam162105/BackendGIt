const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb"); // Import MongoClient
const { fetchUserDetailsAndRelatedData } = require("./Dashboard");

const uri = process.env.MONGO_URI; // Your MongoDB connection string
const client = new MongoClient(uri);

async function signup(req, res) {
  const { username, password, email } = req.body; // Extract username, password, and email from req.body

  try {
    // Connect to the MongoDB client
    await client.connect();

    const db = client.db("test");
    const usersCollection = db.collection("user");

    // Check if the user already exists
    let user = await usersCollection.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document
    const newUser = {
      username,
      password: hashedPassword,
      email, // Include email in the new user document
    };

    // Save the new user to the database
    await usersCollection.insertOne(newUser);

    // Generate a JWT token for the user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } finally {
    await client.close();
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    await client.connect();

    // Select the database and collection
    const db = client.db("GitUsers");
    const usersCollection = db.collection("userInfo");

    // Find the user by username
    const user = await usersCollection.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send back only the token and user ID
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } finally {
    await client.close();
  }
}

module.exports = {
  login,
  signup,
};
