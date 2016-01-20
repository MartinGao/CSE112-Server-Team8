import mongoose from 'mongoose';
import * as ClientController from './client.controller';

const User = mongoose.model('User');

export function create(req,res) {

  if(req.body.role == 1){
    _createAdminUser(req,res);
  }

}

function _createAdminUser(req,res){

  ClientController.createOne(req,(err,newClient) => {

    if(err){
      console.log('client createOne error!');
      console.log(err);
    }
    else{

      User.create({
        role        : 1,
        approved    : true,
        firstName   : req.body.firstName,
        lastName    : req.body.lastName,
        avatar      : req.body.avatar,
        email       : req.body.email,
        password    : req.body.password,
        client      : newClient._id,
        department  : req.body.department,
        position    : req.body.position,
      },(err,newUser) => {
        if(err){
          console.log('user create error!');
          console.log(err);
        }
        else{
          consoel.log(newUser);
        }
      })

    }

  })

}
