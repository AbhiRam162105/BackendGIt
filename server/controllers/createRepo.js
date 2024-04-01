const mongoose = require("mongoose");
const Repository = require("../models/repoModel"); // Adjust the path as necessary

async function createRepo(req, res) {
  try {
    const {
      userId,
      repositoryName,
      description = "",
      publicOrPrivate = "public",
      type,
      content = "",
      parent = null,
      issues = [],
    } = req.body;

    // Check for required fields
    if (!repositoryName || !type) {
      return res
        .status(400)
        .json({ error: "Repository name and type are required." });
    }

    // If the repository is a file, ensure content is provided
    if (type === "file" && !content) {
      return res
        .status(400)
        .json({ error: "Content is required for file repositories." });
    }

    // Ensure parent, if provided, is a valid ObjectId
    if (parent && !mongoose.Types.ObjectId.isValid(parent)) {
      return res.status(400).json({ error: "Invalid parent ID." });
    }

    // Ensure issues, if provided, are valid ObjectIds
    if (issues.some((issue) => !mongoose.Types.ObjectId.isValid(issue))) {
      return res.status(400).json({ error: "Invalid issue ID(s)." });
    }

    const newRepository = new Repository({
      name: repositoryName,
      description,
      publicOrPrivate,
      owner: userId,
      type,
      content,
      parent,
      issues,
    });

    const result = await newRepository.save();

    res.status(201).json({
      message: "Repository created successfully.",
      repositoryId: result._id,
    });
  } catch (error) {
    console.error("Error creating repository:", error);
    res.status(500).json({ error: "Failed to create repository." });
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({});
    res.json(repositories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repositories" });
  }
}

async function getRepositoryById(req, res) {
  try {
    const repository = await Repository.findById(req.params.id)
      .populate("owner")
      .populate("issues");
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    res.json(repository);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch repository" });
  }
}

async function updateRepositoryById(req, res) {
  try {
    const { name, type, parent, content, owner } = req.body;
    const repository = await Repository.findByIdAndUpdate(
      req.params.id,
      { name, type, parent, content, owner },
      { new: true }
    );
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    res.json({ message: "Repository updated successfully", repository });
  } catch (error) {
    res.status(500).json({ error: "Failed to update repository" });
  }
}

async function deleteRepositoryById(req, res) {
  try {
    const repository = await Repository.findByIdAndDelete(req.params.id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found" });
    }
    res.json({ message: "Repository deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete repository" });
  }
}
module.exports = {
  createRepo,
  getAllRepositories,
  getRepositoryById,
  updateRepositoryById,
  deleteRepositoryById,
};
