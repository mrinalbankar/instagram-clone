const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: String
    },
    comm: [{
      userId: {
        type: String
      },
      text: {
        type: String
      }
    }],
    subComment: {
      type: String
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Comment', commentSchema)