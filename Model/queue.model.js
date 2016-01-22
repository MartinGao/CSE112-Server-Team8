/**
 * Schema for Queue
 */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const QueueSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  checked: {
    type: Date,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User',
  },
  avatar: {
    type: String,
    default: null,
  },
});

export default mongoose.model('queue', QueueSchema);
