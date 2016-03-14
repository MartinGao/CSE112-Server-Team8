/**
 * Controller for analytics
 */

 import mongoose from 'mongoose';
 const Analytics = mongoose.model('Analytics');

// prices per month for each plan level
 const basic = 30;
 const popular = 60;
 const premier = 90;

 export function createAnalytics(req, res) {
   const missing = [];

   if (!req.body.planLevel) {
     missing.push('missing: payment plan level');
   }
   if (!req.body.avgNumEmployees) {
     missing.push('missing: average number of employees per business');
   }
   if (!req.body.numMonthlySignups) {
     missing.push('missing: number of monthly signups');
   }
   if (!req.body.numClientsBasic) {
     missing.push('missing: number of clients for basic plan level');
   }
   if (!req.body.numClientsPopular) {
     missing.push('missing: number of clients for popular plan level');
   }
   if (!req.body.numClientsPremier) {
     missing.push('missing: number of clients for premier plan level');
   }
   if (missing.length) {
     return res.status(400).send({
       Error: missing.join(',\n'),
     });
   }

   const newAnalytics = new Analytics();
   newAnalytics.planLevel = req.body.planLevel;
   newAnalytics.totalClients = parseInt(req.body.numClientsBasic) +
                               parseInt(req.body.numClientsPopular) +
                               parseInt(req.body.numClientsPremier);
   newAnalytics.avgNumEmployees = req.body.avgNumEmployees;
   newAnalytics.numMonthlySignups = req.body.numMonthlySignups;
   newAnalytics.numClientsBasic = req.body.numClientsBasic;
   newAnalytics.numClientsPopular = req.body.numClientsPopular;
   newAnalytics.numClientsPremier = req.body.numClientsPremier;

   // calculating monthly income
   newAnalytics.totalIncome = (req.body.numClientsBasic * basic) +
                              (req.body.numClientsPopular * popular) +
                              (req.body.numClientsPremier * premier);

   newAnalytics.save((err, updatedAnalytics) => {
     if (err) {
       return res.status(400).send(err);
     }
     if (updatedAnalytics) {
       return res.status(200).send(updatedAnalytics);
     }
   });
 }

 export function deleteAnalytics(req, res) {
   // TODO
 }
