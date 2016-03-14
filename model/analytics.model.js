/**
 * Schema for analytics
 */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AnalyticsSchema = new Schema({
  planLevel: {
    type: String,
    ref: 'Business',
    required: true,
  },
  totalClients: {
    type: Number,
  },
  avgNumEmployees: {
    type: Number,
    required: true,
  },
  numMonthlySignups: {
    type: Number,
    required: true,
  },
  totalIncome: {
    type: Number,
  },
  numClientsBasic: {
    type: Number,
    required: true,
  },
  numClientsPopular: {
    type: Number,
    required: true,
  },
  numClientsPremier: {
    type: Number,
    required: true,
  },
  timeStamp: {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
});

AnalyticsSchema.pre('update', (next) => {
  this.timeStamp.updated = new Date();
  next();
});

export default mongoose.model('Analytics', AnalyticsSchema);
