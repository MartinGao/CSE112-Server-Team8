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

   newAnalytics.planLevel = req.body.planLevel;

   newAnalytics.numMonthlySignups = req.body.numMonthlySignups;
   newAnalytics.numEmployees = req.body.numEmployees;
   newAnalytics.numClientsBasic = req.body.numClientsBasic;
   newAnalytics.numClientsPopular = req.body.numClientsPopular;
   newAnalytics.numClientsPremier = req.body.numClientsPremier;

   /*
    * sum up number of clients (businesses) per plan level to
    * get total number of clients (businesses)
    */
   newAnalytics.totalClients = parseInt(req.body.numClientsBasic) +
                               parseInt(req.body.numClientsPopular) +
                               parseInt(req.body.numClientsPremier);

   /*
    * total number of employees divided by the number of businesses is
    * the average number of employees per businesses
    */
   newAnalytics.avgNumEmployees = parseInt(newAnalytics.numEmployees) /
                                  parseInt(newAnalytics.totalClients);

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
   const missing = [];

   if (!req.body.deleteAnalyticsId) {
     missing.push('deleteAnalyticsId');
   }
   if (missing.length) {
     return res.status(400).send({ Error: 'missing ' + missing.join(', ') });
   }

   Analytics.findOneAndRemove({
     _id: req.body.deleteAnalyticsId }).exec((err1) => {
       if (err1) {
         return res.status(400).send(err1);
       }
       return res.status(200).send({ Success: 'analytics page was deleted!' });
     });
 }
