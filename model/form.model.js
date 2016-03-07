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
  businessType: {
    type: String,
    default: 'other',
  },
  form: {
    type: Object,
    required: true,
  },
  timeStamp: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
});

FormSchema.pre('update', (next) => {
  this.timeStamp.updated = new Date();
  next();
});

export default mongoose.model('Form', FormSchema);
