import express from 'express';
import mongoose from 'mongoose';
import chalk from 'chalk';
import bodyParser from 'body-parser';

const TEST_DB = 'mongodb://admin:Qgj4zFWLnig2YW@ds019038.mlab.com:19038/cse112';

//  Models
import userModel from './model/user.model';
import businessModel from './model/business.model';
import visitorModel from './model/visitor.model';
import formModel from './model/form.model';

//  Routes
import userRoute from './route/user.route';
import businessRoute from './route/business.route';
import testRoute from './route/test.route';
import visitorRoute from './route/visitor.route';
import formRoute from './route/form.route';

const app = module.exports = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

userModel(app);
businessModel(app);
visitorModel(app);
formModel(app);

userRoute(app);
businessRoute(app);
testRoute(app);
visitorRoute(app);
formRoute(app);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/doc', express.static(__dirname + '/doc'));


// app.get('/doc', (req, res) => {
//   res.sendFile('index.html', { root: './doc/' });
// });
//
// app.get('/main.js', (req, res) => {
//   res.sendFile('main.js', { root: './doc/' });
// });

app.get('/vendor/:path', (req, res) => {
  const path = req.params.path;
  res.sendFile(path, { root: './doc/vendor/' });
});


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
