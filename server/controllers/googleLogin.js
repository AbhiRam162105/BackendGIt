const jwt = require("jsonwebtoken");
const { MongoClient } = require("mongodb");
const { fetchUserDetailsAndRelatedData } = require("./Dashboard");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function googleLogin(req, res) {
  const { code } = req.body;

  try {
    await client.connect();

    const db = client.db("test");
    const usersCollection = db.collection("users");

    const userDetails = await fetchUserDetailsAndRelatedData(code);

    let user = await usersCollection.findOne({
      googleId: userDetails.googleId,
    });
    if (!user) {
      const newUser = {
        username: userDetails.username,
        email: userDetails.email,
        googleId: userDetails.googleId,
      };

      const result = await usersCollection.insertOne(newUser);
      user = result.ops[0];
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, userId: user._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  } finally {
    await client.close();
  }
}

module.exports = {
  googleLogin,
};
