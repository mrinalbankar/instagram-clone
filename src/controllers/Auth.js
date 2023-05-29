const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//signup user
router.post('/signup', async (req, res) => {
  const { name, password, email_id, user_name, gender, mobile, profile } = req.body

  if (password.length < 8) {
    return res.status(400).send('Password must be at least 8 characters long');
  }

  let emailExists = await User.findOne({ email_id: req.body.email_id })
  if (emailExists) {
    return res.status(400).send("Email already exists")
  }

  let usernameExists = await User.findOne({ user_name: req.body.user_name })
  if (usernameExists) {
    return res.status(400).send("Username already exists")
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const newUser = new User({
    name: req.body.name,
    password: hashedPassword,
    email_id: req.body.email_id,
    user_name: req.body.user_name,
    gender: req.body.gender,
    mobile: req.body.mobile,
    profile: req.body.profile
  })

  try {
    const savedUser = await newUser.save()
    res.status(200).json(savedUser)

  } catch (err) {
    res.status(500).json(err)
  }
})


//login
router.post('/login', async (req, res) => {
  try {
    const { email_id, password } = req.body
    if (!(email_id || password)) {
      return res.status(400).send("Please enter email and password")
    }

    const user = await User.findOne({ email_id: req.body.email_id })
    if (!user) {
      return res.status(400).send("Invalid email or password")
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(400).send("Invalid email or password")
    }

    const token = jwt.sign(
      { id: user._id, },
      process.env.JWT_SEC,
      { expiresIn: process.env.JWT_EXPIRES_TIME }
    )
    res.status(200).json({ token, user })

  } catch (err) {
    res.status(500).json(err)
  }
})


module.exports = router