const mongoose = require("mongoose");
const { MongoClient } = require('mongodb');
let db;

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String // You should hash passwords before saving
});

const User = mongoose.models.User || mongoose.model("User", userSchema);


var checkEmail = function(email, callback) {

  db.collection('users').findOne({
      email: email
  }).then((emailExists) => {

      if (emailExists) {
          callback(null, 'Email in use');
      } else {
          callback(null, 'Success');
      }

  })

}

module.exports = {
  User,
  checkEmail,
};