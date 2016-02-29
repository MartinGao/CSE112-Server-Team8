import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var VisitorSchema = new Schema({
  businessId: {
    type: Schema.ObjectId, 
    ref: "Business",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  checkIn: {
    type: Date,
    default: Date.now
  },
  checkOff: {
    type: Date,
    default: null
  },
  forms: {
    type: Object,
    default: null
  },
  timeStamp: {
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now}
  }
});

VisitorSchema.pre('save', function (next) {
    this.timeStamp.updated = new Date();
    next();
});

export default mongoose.model('Visitor', VisitorSchema);

