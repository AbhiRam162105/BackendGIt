exports.createRepo = async (req, res) => {
  try {
    const {
      ownerName,
      repositoryName,
      description = "",
      publicOrPrivate = "public",
    } = req.body;

    // Validate required fields
    if (!ownerName || !repositoryName) {
      return res
        .status(400)
        .json({ error: "Owner name and repository name are required." });
    }

    // Prepare the object to be inserted
    const newObject = {
      ownerName,
      repositoryName,
      description,
      publicOrPrivate,
    };

    // Insert the new object into the database
    const result = await db.collection("objects").insertOne(newObject);

    // Send the result back to the client
    res.status(201).json({
      message: "Object created successfully.",
      objectId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating object:", error);
    res.status(500).json({ error: "Failed to create object." });
  }
};
