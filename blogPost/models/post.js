const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }
  ]
});

module.exports = mongoose.model('post', postSchema);
