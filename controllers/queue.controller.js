import mongoose from 'mongoose';
const Queue = mongoose.model('Queue');


export function create(req, res) {
  Queue.create({
    name: req.body.name,
    email: req.body.email,
    reason: req.body.reason,
    user: req.body.user,
    avatar: req.body.avatar,
  }, (err, newQueue) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(200).send(newQueue);
    }
  });
}
