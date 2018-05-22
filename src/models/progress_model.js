import mongoose, { Schema } from 'mongoose'

const ProgressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  feelingToday: [
    {
      timestamp: Date,
      value: Number,
    },
  ], // Contains { Date, Int }
  dailyReminderCompletion: [
    {
      timestamp: Date,
      completed: Boolean,
      completionCount: Number,
    },
  ], // Contains { Date, Boolean, Int}
})

ProgressSchema.set('toJSON', {
  virtuals: true,
})

const ProgressModel = mongoose.model('Progress', ProgressSchema)

export default ProgressModel
