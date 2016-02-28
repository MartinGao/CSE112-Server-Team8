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
    //change to match schema
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true
    },
    
    //what url
    url: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    owner: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }

});

export default mongoose.model('Business', BusinessSchema);
