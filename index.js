import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk';
import bodyParser from 'body-parser';

const TEST_DB = 'mongodb://db.siriolabs.com/cse112-dev-test';

//Models
// import rateModel from './model/rate.model';


//Routes
// import hotelsRoute from './routes/hotels.routes';


const app = module.exports = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// rateModel(app);

mongoose.connect(TEST_DB, (err) => {
  if (err) {
    console.error(chalk.red('Could not connect to MongoDB!'));
    console.log(chalk.red(err));
  } else {
    console.log(chalk.green('Successfully connect to MongoDB!'));
    let PORT = 3003;
    var server = app.listen(PORT, function() {
      console.log('Express server listening on port ' + PORT);
    });
  }
});
