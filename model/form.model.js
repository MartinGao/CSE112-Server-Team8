/**
 * Schema for Forms
 */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FormSchema = new Schema({
  businessId: {
    type: Schema.ObjectId,
    ref: 'Business',
  },
  description: {
    type: String,
    required: true,
  },
  form: {
    type: Object,
    required: true,
  },
  timestamp: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
});

FormSchema.pre('save', (next) => {
  this.timestamp.updated = new Date();
  next();
});

export default mongoose.model('Form', FormSchema);
