import mongoose, { Schema } from 'mongoose'

const ProgressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  feelingToday: [{ type: Object }], // Should contain { Date, Int }
  // reminderCompletion: { type: Reminder }
})

ProgressSchema.set('toJSON', {
  virtuals: true,
})

const ProgressModel = mongoose.model('Progress', ProgressSchema)

export default ProgressModel
