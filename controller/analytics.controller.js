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

   if (!req.body.totalClients) {
     missing.push('missing: total number of clients');
   }
   if (!req.body.avgNumEmployees) {
     missing.push('missing: average number of employees per business');
   }
   if (!req.body.numMonthlySignups) {
     missing.push('missing: number of monthly signups');
   }
   if (!req.body.totalIncome) {
     missing.push('missing: total monthly income');
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
       Error: missing.join(', '),
     });
   }

   const newAnalytics = new Analytics();
   newAnalytics.totalClients = req.body.totalClients;
   newAnalytics.avgNumEmployees = req.body.avgNumEmployees;
   newAnalytics.numMonthlySignups = req.body.numMonthlySignups;
   newAnalytics.numClientsBasic = req.body.numClientsBasic;
   newAnalytics.numClientsPopular = req.body.numClientsPopular;
   newAnalytics.numClientsPremier = req.body.numClientsPremier;

   // calculating monthly income
   if (req.body.planLevel === 'basic') {
     newAnalytics.totalIncome = req.body.numClientsBasic * basic;
   } else if (req.body.planLevel === 'popular') {
     newAnalytics.totalIncome = req.body.numClientsPopular * popular;
   } else {
     newAnalytics.totalIncome = req.body.numClientsPremier * premier;
   }

   newAnalytics.save((err, updatedAnalytics) => {
     if (err) {
       return res.status(400).send({ Error: 'failed to update analytics.' });
     }
     if (updatedAnalytics) {
       return res.status(200).send(updatedAnalytics);
     }
   });
 }

 export function deleteAnalytics(req, res) {
   // TODO
 }
