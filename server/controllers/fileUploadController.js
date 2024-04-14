const { uploadFile } = require("./s3Upload");

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }
    const bucketName = "git-repoclone-bucket";
    const filePath = file.originalname;
    const fileUrl = await uploadFile(bucketName, filePath, file.buffer);
    res.status(200).send({ fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to upload file.");
  }
};
