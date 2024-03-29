const mongoose = require("mongoose");
const { Schema } = mongoose;

const RepositorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["file", "folder"],
    required: true,
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Repository",
  },
  children: [
    {
      type: Schema.Types.ObjectId,
      ref: "Repository",
    },
  ],
  content: {
    type: String,
    required: function () {
      return this.type === "file";
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue", // Reference to the Issue model
    },
  ],
});

const Repository = mongoose.model("Repository", RepositorySchema);

module.exports = Repository;
