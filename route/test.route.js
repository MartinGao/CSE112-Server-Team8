module.exports = function (app) {
  app.route('/ping').get((req, res) => {
    res.send({
      message: 'Pong! 0.2.1'
    });
  });
};
