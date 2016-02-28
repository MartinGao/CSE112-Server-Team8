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
  created: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: Number,
    default: 0,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
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
    required: true,
    ref: 'Business',
  },
  department: {
    type: String,
    default: null,
  },
  position: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    required: true,
  },
  tokenExpiredAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('User', UserSchema);
