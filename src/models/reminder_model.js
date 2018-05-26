import mongoose, { Schema } from 'mongoose'
import moment from 'moment'

const ReminderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', require: true },
  type: { type: String, required: true },
  times: [{ label: String, value: Number }],
  active: { type: Boolean, default: false },
  completion: [{ date: { type: String, default: moment().format('MMM D, YYYY') }, completed: [{ hour: Number, completion: Boolean }] }], // dictionary format : { date: { hour, completion } }
})

ReminderSchema.set('toJSON', {
  virtuals: true,
})

const ReminderModel = mongoose.model('Reminder', ReminderSchema)

export default ReminderModel
