const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const upload = require('../config/multerConfig')
const cloudinary = require('../config/cloudinaryConfig')
const { verifyToken } = require('../middlewares/verifyToken')
const User = require('../models/User')

// create/upload new post
router.post('/upload', verifyToken, upload.single("file"), async (req, res) => {

  try {
    let result = await cloudinary.uploader.upload(req.file.path)
    let post = new Post({
      userId: req.user.userId,
      text: req.body.text,
      status: req.body.status,
      hashtag: req.body.hashtag,
      imageUrl: result.secure_url,
      imageId: result.public_id,
      likes: req.body.likes
    })

    await post.save()
    res.status(200).json(post)

  } catch (err) {
    res.status(500).json(err)
  }
})


//edit own post
// router.put('/:id', verifyToken, upload.single("file"), async (req, res) => {
//   try {
//     let editPost = await Post.findById(req.params.id)
//     await cloudinary.uploader.upload.destroy(editPost.imageId)
//     console.log(editPost.imageId)

//     let editResult = await cloudinary.uploader.upload(req.file.path)
//     let data = {
//       userId: req.user.userId,
//       text: req.body.text || editPost.text,
//       status: req.body.status || editPost.status,
//       hashtag: req.body.hashtag || editPost.hashtag,
//       imageUrl: editResult.secure_url || editPost.imageUrl,
//       imageId: editResult.public_id || editPost.public_id,
//       likes: req.body.likes || editPost.likes
//     }

//     editPost = await Post.findByIdAndUpdate(req.params.id, data, { new: true })
//     res.status(200).json(editPost)

//   } catch (err) {
//     res.status(500).json(err)
//   }
// })


//like post (one at a time)
router.put('/like/:id', verifyToken, async (req, res) => {
  try {

    const post = await Post.findOne({ _id: req.params.id })
    let all_likes = post.likes

    if (all_likes.length <= 0) {
      const likePost = await Post.findByIdAndUpdate(req.params.id,
        { $push: { likes: req.user.userId } }
      )
      return res.status(200).json(likePost)
    }

    for (let i = 0; i <= all_likes.length; i++) {
      if (all_likes.includes(req.user.userId)) {
        return res.status(404).json("User already liked the post")
      }
      else {
        const likePost = await Post.findByIdAndUpdate(req.params.id,
          { $push: { likes: req.user.userId } }
        )
        return res.status(200).json(likePost)
      }
    }

  } catch (err) {
    res.status(500).json(err)
  }
})


//list posts liked by current user, excluding own posts
router.get('/mylist', verifyToken, async (req, res) => {
  try {
    const posts = await Post.find({
      $and: [
        { userId: { $ne: req.user.userId } },
        { likes: req.user.userId }
      ]
    })
    return res.status(200).json(posts)

  } catch (err) {
    res.status(500).json(err)
  }
})


//list all public posts with the users who liked the post in DESC order
router.get('/list', verifyToken, async (req, res) => {
  try {
    const posts = await Post.aggregate([
      { $match: { status: "public" } },
      {
        $lookup: { from: "users", localField: "likes", foreignField: "userId", as: "liked_by_users" }
      }
    ]).limit(10).sort({ "createdAt": -1 })

    return res.status(200).json(posts)

  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router



