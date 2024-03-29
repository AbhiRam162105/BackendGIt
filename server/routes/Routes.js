const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const issueController = require("../controllers/issueController.js");
const { createRepo } = require("../controllers/createRepo.js");

// Check for authentication status
router.get("/", (req, res) => {
  res.send("Welcome");
});

// User-related routes
router.get("/userinfo", userController.getAllUsers);
router.post("/users/create", userController.createUser); // Changed to /users/create
router.get("/profile", userController.getProfile);
router.get("/users", userController.getAllUsers); // Changed to /users
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUserById);
router.delete("/users/:id", userController.deleteUserById);

// Repository-related routes
router.post("/repos/create", createRepo); // Changed to /repos/create

// Issue-related routes
router.post("/issues", issueController.createIssue);
router.get("/issues", issueController.getAllIssues);
router.get("/issues/:id", issueController.getIssueById);
router.put("/issues/:id", issueController.updateIssueById);
router.delete("/issues/:id", issueController.deleteIssueById);

module.exports = router;
