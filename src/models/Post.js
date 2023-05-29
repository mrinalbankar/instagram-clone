const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      max: 500,
    },
    status: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    hashtag: {
      type: Array,
      default: [],
    },
    imageUrl: {
      type: String,
    },
    imageId: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);