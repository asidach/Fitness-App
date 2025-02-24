require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// create the schema
const User = mongoose.model("User", UserSchema);

// check if the username that a user input already exists in the database
app.get("/check-username", async (req, res) => {
  const { username } = req.query;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      res.json({ success: true, message: "Username already exists" });
    } else {
      res.json({ success: true, message: "Username does not exist" })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// check if the email that a user input already exists in the database
app.get("/check-email", async (req, res) => {
  const { email } = req.query;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.json({ success: true, message: "Email already exists" });
    } else {
      res.json({ success: true, message: "Email does not exist" })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// create a new user in the database
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ success: true, message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// attempt login based on the username and password entered
app.get("/login", async (req, res) => {
  const { username, password } = req.query;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.json({ success: true, message: "No username found" });
    } else {

      const passwordMatch = password === user.password;

      if (!passwordMatch) {
        res.json({ success: true, message: "Invalid username or password" });
      } else {
        res.json({ success: true, message: "Successful login" });
      }

    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));