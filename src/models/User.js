const mongoose = require('mongoose')
var autoIncrement = require('mongoose-sequence')(mongoose)
const validator = require('validator')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter user name'],
      maxlength: [30, 'Name cannot exceed 30 characters']
    },
    userId: {
      type: Number
    },
    password: {
      type: String,
      required: true,
      match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,
      minlength: 8
    },
    email_id: {
      type: String,
      required: [true, 'Please enter user email'],
      unique: true,
      validate: [validator.isEmail, 'Please enter a valid email address']
    },
    user_name: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    mobile: {
      type: String
    },
    profile: {
      type: String,
      enum: ["public", "private"],
      default: "public"
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    blocklist: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
)

userSchema.plugin(autoIncrement, { inc_field: 'userId' })
module.exports = mongoose.model('User', userSchema)