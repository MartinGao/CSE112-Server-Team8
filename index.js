import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk';
import bodyParser from 'body-parser';

const TEST_DB = 'mongodb://db.siriolabs.com/cse112-dev-test';

//  Models
import userModel from './model/user.model';
import businessModel from './model/business.model';
import visitorModel from './model/visitor.model';

//  Routes
import userRoute from './route/user.route';
import businessRoute from './route/business.route';
import testRoute from './route/test.route';
import visitorRoute from './route/visitor.route';

const app = module.exports = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

userModel(app);
businessModel(app);
visitorModel(app);

userRoute(app);
businessRoute(app);
testRoute(app);
visitorRoute(app);

mongoose.connect(TEST_DB, (err) => {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  } else {
    console.log(chalk.green('Successfully connect to MongoDB!'));
    const PORT = 3000;
    var server = app.listen(PORT, function() {
      console.log('Express server listening on port ' + PORT);
    });
  }
});
