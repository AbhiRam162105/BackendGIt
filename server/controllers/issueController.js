const Issue = require("../models/issues.js");

async function createIssue(req, res) {
  try {
    const issue = new Issue(req.body);
    await issue.save();
    res.status(201).json({ message: "Issue created successfully", issue });
  } catch (error) {
    res.status(500).json({ error: "Failed to create issue" });
  }
}

async function getAllIssues(req, res) {
  try {
    const issues = await Issue.find({});
    res.json(issues);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issues" });
  }
}

async function getIssueById(req, res) {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch issue" });
  }
}

async function updateIssueById(req, res) {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json({ message: "Issue updated successfully", issue });
  } catch (error) {
    res.status(500).json({ error: "Failed to update issue" });
  }
}

async function deleteIssueById(req, res) {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete issue" });
  }
}

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueById,
  deleteIssueById,
};
