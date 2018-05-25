import mongoose, { Schema } from 'mongoose'

const ReminderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  type: { type: String, required: true },
  times: [{ type: Date }],
  active: { type: Boolean, default: false },
  completion: [{
    id: Schema.Types.ObjectId,
    timestamp: Date,
    completed: Boolean,
  }],
})

ReminderSchema.set('toJSON', {
  virtuals: true,
})

const ReminderModel = mongoose.model('Reminder', ReminderSchema)

export default ReminderModel
