const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
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
const {
  createIssue,
  updateIssue,
  fetchIssueById,
  fetchAllIssues,
} = require("../controllers/issueControllers.js");

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
router.post("/repos/repoid", getRepositoryIdByName);
router.put("/repos/:id", updateRepositoryById);
router.delete("/repos/:id", deleteRepositoryById);

// Dashboard routes
router.get("/user/followed-repositories", fetchRepositoriesOfFollowedUsers);
router.get("/user/repositories", fetchRepositoriesOfLoggedInUser); // Changed from "/user/user-repositories" to "/user/repositories" for consistency

// Issue-related routes
router.get("/repo/issue", fetchAllIssues);
router.get("/repo/issue/:id", fetchIssueById);
router.post("/repo/issue/:id", createIssue);
router.put("/repo/issue/:id", updateIssue);

module.exports = router;
