const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { verifyToken } = require('../middlewares/verifyToken')
const bcrypt = require('bcryptjs')

//edit user details : change password, set profile status etc.
router.put('/:id', verifyToken, async (req, res) => {

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  try {
    let updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          password: hashedPassword,
          email_id: req.body.email_id,
          user_name: req.body.user_name,
          gender: req.body.gender,
          mobile: req.body.mobile,
          profile: req.body.profile
        }
      },
      { new: true }
    )
    res.status(200).json(updateUser)

  } catch (err) {
    res.status(500).json(err)
  }
})


//get profile details
router.get('/details', verifyToken, async (req, res) => {
  try {
    const profile = await User.findOne({ userId: req.body.userId },
      {
        _id: 0, password: 0, mobile: 0, profile: 0, blocklist: 0,
        createdAt: 0, updatedAt: 0, userId: 0, __v: 0
      })

    if (!profile) {
      return res.status(404).json("Profile not found")
    }
    let followers = profile.followers.length
    let following = profile.following.length
    res.status(200).json({ profile, followers, following })

  } catch (err) {
    res.status(500).json(err)
  }
})


//follow a user
router.put('/follow', verifyToken, async (req, res) => {
  
})


module.exports = router