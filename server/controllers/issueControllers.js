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
    const { issueId } = req.params;

    const issue = await Issue.findById(issueId);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch issue" });
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
  fetchIssueById,
  createIssue,
  updateIssue,
};