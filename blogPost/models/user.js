// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  age: {
    type: Number,
    default: 0
  },
profilePic:{
  type:String,
  default:"profile.png"
},
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'post'  // assuming there's a Post model
    }
  ]
}, {
  timestamps: true  // adds createdAt and updatedAt
});

module.exports = mongoose.model('user', userSchema);
