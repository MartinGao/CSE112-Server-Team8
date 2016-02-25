/**
 * Schema for Forms
 */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const FormSchema = new Schema({
  formId: {
    type: Schema.ObjectId,
    default: null;
  },
  businessId: {
    type: Schema.ObjectId,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: null,
  },
});

export default mongoose.model('Form', FormSchema);
