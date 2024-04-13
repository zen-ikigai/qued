import mongoose, { Schema, model, models } from 'mongoose'

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exists'],
      index: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      match: [/^[a-zA-Z0-9.-]+$/, 'Username is invalid'],
      index: true,
    },
    image: {
      type: String,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
      },
    ],
  },
  { timestamps: true },
)
const User = models.User || model('User', userSchema)
export { User }
