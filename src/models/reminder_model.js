import mongoose, { Schema } from 'mongoose'

const ReminderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String },
  frequency: { type: String },
  times: [{ type: Date }],
  toggle: { type: Boolean },
  completion: [{ type: Object }], // Should contain { Date, Int }
})

ReminderSchema.set('toJSON', {
  virtuals: true,
})

const ReminderModel = mongoose.model('Reminder', ReminderSchema)

export default ReminderModel
