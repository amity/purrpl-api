import mongoose, { Schema } from 'mongoose'

const AvatarSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'happy' },
  message: { type: String, default: 'Happy' },
})

AvatarSchema.set('toJSON', {
  virtuals: true,
})

const AvatarModel = mongoose.model('Avatar', AvatarSchema)

export default AvatarModel
