/**
 * Schema for User
 *
 * Notes
 * For role: 0 => Unassigned
 * 						1 => Admin (Who is in charge of one or more clients)
 * 						2 => Manager (Who is in charge of one client)
 * 						3 => Employee (Just a normal employee)
 */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  role: {
    type: Number,
    default: 0,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  business: {
    type: Schema.ObjectId,
    required: false,
    default: null,
    ref: 'Business',
  },
  timeStamp: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
  settings: {
    receiveSMS: {
      type: Boolean,
      default: null,
    },
    receiveEmail: {
      type: Boolean,
      default: null,
    },
    receiveBrowserNotification: {
      type: Boolean,
      default: null,
    },
    theme: {
      type: String,
      default: null,
    },
  },
});

UserSchema.pre('update', (next) => {
  this.timeStamp.updated = new Date();
  next();
});

export default mongoose.model('User', UserSchema);
