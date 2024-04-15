const mongoose = require("mongoose");
const Issue = require("../models/issues.js");

async function createIssue(req, res) {
  try {
    const { title, description } = req.body;
    const { id } = req.params; // Simplified for demonstration

    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();

    res.status(201).json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create issue" });
  }
}

async function fetchIssueById(req, res) {
  try {
    const { id } = req.params;
    console.log("====================================");
    console.log("id", id);
    console.log("====================================");
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    console.log("====================================");
    console.log(issue);
    console.log("====================================");
    res.status(200).json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch issue" });
  }
}

async function fetchAllIssues(req, res) {
  try {
    const { id } = req.params;
    const issues = await Issue.find({ repository: id });
    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
}

async function fetchAllUserIssues(req, res) {
  try {
    const issues = await Issue.find();

    res.status(200).json(issues);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user issues" });
  }
}

async function updateIssue(req, res) {
  try {
    const { title, description, status } = req.body;

    const issue = await Issue.findOne({ title });
    console.log(issue);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    if (description) issue.description = description;
    if (status) issue.status = status;

    // Save the updated issue
    console.log(issue);
    await issue.save();

    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: "Failed to update issue" });
  }
}

module.exports = {
  fetchAllUserIssues,
  fetchAllIssues,
  fetchIssueById,
  createIssue,
  updateIssue,
};
