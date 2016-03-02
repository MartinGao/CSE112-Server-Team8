/**
 * Created by besin on 2/26/2016.
 */
import mongoose from 'mongoose';
const Business = mongoose.model('Business');

export function newBusiness(req, res, next) {
    var missing = [];

    if (!req.body.ownerId)
        missing.push("missing ownerId");
    if (!req.body.email)
        missing.push("missing email");
    if (!req.body.phone)
        missing.push("missing phone");
    if (missing.length) {
        return res.status(400).send({
            "Error": missing.join(', ')
        });
    }

    if (req.body.businessId)
    Business.findOne({businessId: req.body.businessId}).exec(function(err, business) {
        if (err)
            return res.status(400).send(err);
        if (business) {
            business.url = req.body.url;
            business.logo = req.body.logo || null;
            business.description = req.body.description || null;
            business.owner = req.body.owner;
            business.save(function(err, updatedBusiness) {
                if (err)
                    return res.status(400).send(err);
                return res.status(200).send(updatedBusiness);
            });
        }
    });

    var newBusiness = new Business();
    newBusiness.businessId = newBusiness.id;
    newBusiness.ownerId = req.body.ownerId;
    newBusiness.email = req.body.email;
    newBusiness.phone = req.body.phone;
    newBusiness.iconURL = req.body.iconURL || null;
    newBusiness.backgroundImageUrl = req.body.backgroundImageUrl || null;
    newBusiness.userIds = req.body.userIds || null;
    newBusiness.timeStamp = {created: new Date(), updated: new Date()};
    newBusiness.save(function(err, updatedBusiness) {
        if (err)
            return res.status(400).send(err);
        return res.status(200).send(updatedBusiness);
    });
}

export function getBusiness(req, res, next) {
    var bid = req.query.businessId;
    if (!bid)
        return res.status(400).send({
            "Error": "Please provide businessId"
        });

    Business.findOne({businessId: bid}).exec(function(err, business) {
        if (err)
            return res.status(400).send(err);
        else if (business)
            return res.status(200).send(business);
        else
            return res.status(404);
    });
}

export function _search(req, res, next) {

}