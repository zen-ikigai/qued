import mongoose, { Schema, model, models } from 'mongoose'

const taskSchema = new Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      index: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      default: 'todo', //'inProgress', 'done'
    },
    dueDate: {
      type: Date,
      index: true,
    },
    reminder: {
      type: Boolean,
    },
  },
  { timestamps: true },
)
const Task = models.Task || model('Task', taskSchema)
export { Task }
