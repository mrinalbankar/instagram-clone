const jwt = require('jsonwebtoken')
const User = require('../models/User')

const verifyToken = async (req, res, next) => {
  
  const authHeader = req.headers['authorization']
  if (!authHeader) {
    return res.status(403).json("Login is required")
  }

  const token = authHeader?.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SEC)
  req.user = await User.findById(decoded.id)

  if (!req.user) {
    return res.status(403).json("Login is required")
  }

  next()
}

module.exports = { verifyToken }