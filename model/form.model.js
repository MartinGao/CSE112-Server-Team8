/**
 * Schema for Forms
 */

import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var FormSchema = new Schema({
  businessId: {
    type: Schema.ObjectId,
    ref: 'Business',
  },
  description: String,
  form: Object,
  timestamp: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
  },
});

FormSchema.pre('save', function (next) {
  this.timestamp.updated = new Date();
  next();
});

export default mongoose.model('Form', FormSchema);
