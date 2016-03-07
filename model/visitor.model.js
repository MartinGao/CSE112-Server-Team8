import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const VisitorSchema = new Schema({
  businessId: {
    type: Schema.ObjectId,
    ref: 'Business',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  checkIn: {
    type: Date,
    default: Date.now,
  },
  checkOff: {
    type: Date,
    default: null,
  },
  form: {
    type: Object,
    default: null,
  },
  timeStamp: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
});

VisitorSchema.pre('save', (next) => {
  this.timeStamp.updated = new Date();
  next();
});

export default mongoose.model('Visitor', VisitorSchema);
