require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Create a sample model
const User = mongoose.model("User", new mongoose.Schema({ name: String, email: String }));

/*
// API endpoint to get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// API endpoint to add a user
app.post("/users", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.json(newUser);
});
*/

// import routes
const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
