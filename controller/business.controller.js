/**
 * Created by besin on 2/26/2016.
 */
import mongoose from 'mongoose';
const Business = mongoose.model('Business');

export function newBusiness(req, res) {
    var missing = [];

    if (!req.body.userId)
        missing.push("userId");
    if (!req.body.email)
        missing.push("email");
    if (!req.body.name)
        missing.push("name");
    if (missing.length) {
        return res.status(400).send({
            "Error": 'missing ' + missing.join(', ')
        });
    }

    if (req.body.businessId)
        Business.findOne({businessId: req.body.businessId}).exec(function(err, business) {
            if (err)
                return res.status(400).send(err);
            if (business) {
                business.userId = req.body.userId;
                business.businessId = newBusiness.id;
                business.name = req.body.name;
                business.url = req.body.url;
                business.phone = req.body.phone;
                business.iconURL = req.body.iconURL;
                business.backgroundImageUrl = req.body.backgroundImageUrl;
                business.userIds = req.body.userIds;
                business.formId = req.body.formId;
                business.save(function(err, updatedBusiness) {
                    if (err)
                        return res.status(400).send(err);
                    return res.status(200).send(updatedBusiness);
                });
            }
        });

    var newBusiness = new Business();
    newBusiness.userId = req.body.userId;
    newBusiness.businessId = newBusiness.id;
    newBusiness.name = req.body.name;
    newBusiness.url = req.body.url;
    newBusiness.phone = req.body.phone;
    newBusiness.iconURL = req.body.iconURL || null;
    newBusiness.backgroundImageUrl = req.body.backgroundImageUrl || null;
    newBusiness.userIds = req.body.userIds || null;
    newBusiness.formId = req.body.formId || null;
    newBusiness.save(function(err, updatedBusiness) {
        if (err)
            return res.status(400).send(err);
        return res.status(201).send(updatedBusiness);
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

export function setBusiness(req, res) {
    var bid = req.body.businessId;

    if (!bid)
        return res.status(400).send({
            "Error": "Please provide businessId"
        });

    Business.findOne({businessId: bid}).exec(function (err, business) {
        if (err)
            return res.status(400).send(err);

        business.userId = req.body.userId;
        business.name = req.body.name;
        business.url = req.body.url;
        business.phone = req.body.phone;
        business.iconURL = req.body.iconURL;
        business.backgroundImageUrl = req.body.backgroundImageUrl;
        business.userIds = req.body.userIds;
        business.formId = req.body.formId;
        business.timeStamp.updated = Date.now();

        business.save(function(err, updatedBusiness) {
            if (err)
                return res.status(400).send(err);
            return res.status(200).send(updatedBusiness);
        });

    });
}

export function _search(req, res, next) {

}