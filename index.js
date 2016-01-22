import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk';
import bodyParser from 'body-parser';

const TEST_DB = 'mongodb://db.siriolabs.com/cse112-dev-test';

//  Models
import userModel from './model/user.model';
import clientModel from './model/client.model';


//  Routes
import userRoute from './route/user.route';
import clientRoute from './route/client.route';


const app = module.exports = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


userModel(app);
clientModel(app);

userRoute(app);
clientRoute(app);

mongoose.connect(TEST_DB, (err) => {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  } else {
    console.log(chalk.green('Successfully connect to MongoDB!'));
    const PORT = 3080;
    var server = app.listen(PORT, function () {
      console.log('Express server listening on port ' + PORT);
    });
  }
});
