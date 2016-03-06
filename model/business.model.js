/**
 * Created by besin on 2/25/2016.
 */
/**
 * Schema for Business
 *
 */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const BusinessSchema = new Schema({
  userId: {
    type: Schema.ObjectId,
    required: true,
  },
  businessId: {
    type: Schema.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    default: null,
  },
  phone: {
    type: Object,
    default: null,
  },
  iconURL: {
    type: Object,
    default: null,
  },
  backgroundImageUrl: {
    type: Object,
    default: null,
  },
  userIds: [{
    type: Schema.ObjectId,
    ref: 'User',
  }],
  formId: {
    type: Schema.ObjectId,
    ref: 'Form',
  },
  timeStamp: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
});

BusinessSchema.pre('save', (next) => {
  this.timeStamp.updated = new Date();
  next();
});
export default mongoose.model('Business', BusinessSchema);
