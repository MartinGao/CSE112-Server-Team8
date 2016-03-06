/**
 * Created by besin on 2/26/2016.
 */
import mongoose from 'mongoose';
const Business = mongoose.model('Business');

export function createBusiness(req, callback) {
    //return res.status(500).send({'Error': 'API unsupported'});
    var missing = [];

    if (!req.user)
        missing.push("userId");
    if (!req.body.businessName)
        missing.push("businessName");
    if (missing.length) {
        err = true;
        console.log("missing " + missing.join(', '));
        callback(true, null);
    }
    else {

        var newBusiness = new Business();
        newBusiness.userId = req.user.id;
        newBusiness.businessId = newBusiness.id;
        newBusiness.name = req.body.businessName;
        newBusiness.url = req.body.url;
        newBusiness.phone = req.body.phone;
        newBusiness.iconURL = req.body.iconURL || null;
        newBusiness.backgroundImageUrl = req.body.backgroundImageUrl || null;
        newBusiness.userIds = req.body.userIds || null;
        newBusiness.formId = req.body.formId || null;
        newBusiness.save(callback);
    }
}

export function getBusiness(req, res) {
    let user = req.user;
    console.log("req.user = " + user);
    if (!user)
        return res.status(401).send({"Error": "User unauthenticated."});

    var bid = req.query.businessId;
    if (!bid)
        return res.status(400).send({"Error": "Please provide businessId"});

    Business.findOne({businessId: bid}).exec(function(err, business) {
        if (err)
            return res.status(400).send(err);
        else if (business)
            return res.status(200).send(business);
        else
            return res.status(404).send();
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

        if (req.body.userId)
            business.userId = req.body.userId;
        if (req.body.name)
            business.name = req.body.name;
        if (req.body.url)
            business.url = req.body.url;
        if (req.body.phone)
            business.phone = req.body.phone;
        if (req.body.iconURL)
            business.iconURL = req.body.iconURL;
        if (req.body.backgroundImageUrl)
            business.backgroundImageUrl = req.body.backgroundImageUrl;
        if (req.body.userIds)
            business.userIds = req.body.userIds;
        if (req.body.formId)
            business.formId = req.body.formId;
        if (req.body.slackHook)
            business.slackHook = req.body.slackHook;
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