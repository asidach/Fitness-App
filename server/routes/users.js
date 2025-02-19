const express = require("express");
const router = express.Router();
const User = require("../models/User");

// POST route to create a new user
router.post("/add", async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      const newUser = new User({ username, email, password });
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
  
  module.exports = router;
