import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var VisitorSchema = new Schema({

  businessID: {
    type: Schema.ObjectId, 
    ref: "Business"
  },
  name: String,
  email: String,
  phone: String,
  checkIns: [Date],
  checkOffs: [Date],
  forms: [Object],
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

