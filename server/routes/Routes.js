const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const issueController = require("../controllers/issueController.js");
const login = require("../controllers/Login.js");
const {
  createRepo,
  getAllRepositories,
  getRepositoryById,
  updateRepositoryById,
  deleteRepositoryById,
  getRepositoryIdByName,
} = require("../controllers/createRepo.js");
const {
  fetchRepositoriesOfFollowedUsers,
  fetchRepositoriesOfLoggedInUser,
} = require("../controllers/Dashboard.js");
const { googleLogin, googleSignup } = require("../controllers/googleLogin.js");

// Check for authentication status
router.get("/", (req, res) => {
  res.send("Welcome");
});

// Auth routes
router.post("/login", login.login);
router.post("/signup", login.signup);
router.post("/oauth/google", googleLogin);
router.post("/oauth/google/signup", googleSignup);

// User-related routes
router.get("/userinfo", userController.getAllUsers);
router.post("/users/create", userController.createUser);
router.get("/profile", userController.getProfile);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUserById);
router.delete("/users/:id", userController.deleteUserById);

// Repository-related routes
router.post("/repos/create", createRepo);
router.get("/repos", getAllRepositories);
router.get("/repos/:id", getRepositoryById);
router.get("/repos/repoid", getRepositoryIdByName);
router.put("/repos/:id", updateRepositoryById);
router.delete("/repos/:id", deleteRepositoryById);

// Dashboard routes
router.get("/user/followed-repositories", fetchRepositoriesOfFollowedUsers);
router.get("/user/repositories", fetchRepositoriesOfLoggedInUser); // Changed from "/user/user-repositories" to "/user/repositories" for consistency

// Issue-related routes
router.post("/issues", issueController.createIssue);
router.get("/issues", issueController.getAllIssues);
router.get("/issues/:id", issueController.getIssueById);
router.put("/issues/:id", issueController.updateIssueById);
router.delete("/issues/:id", issueController.deleteIssueById);

module.exports = router;
