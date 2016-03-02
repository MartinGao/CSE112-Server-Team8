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
        required: true
    },
    businessId: {
        type: Schema.ObjectId,
        required: true
    },
    name: String,
    url: String,
    phone: String,
    iconURL: String,
    backgroundImageUrl: String,
    userIds: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    formId: {
        type: Schema.ObjectId,
        ref: 'Form'
    },
    timeStamp: {
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now }
    }
});
BusinessSchema.pre('save', function (next) {
    this.timeStamp.updated = new Date();
    next();
});
export default mongoose.model('Business', BusinessSchema);
