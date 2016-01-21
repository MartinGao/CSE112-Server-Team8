/**
 * Schema for Client
 */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  created: {
    type: Date,
    default: Date.now,
  },
  name : {
    type : String,
    required : true,
  },
  logo : {
    type : String,
    default : null,
  },
  description : {
    type : String,
    default : null,
  },
  owner : {
    type: Schema.ObjectId,
    ref: 'User',
    default : null,
  }
});

export default mongoose.model('Client', ClientSchema);
