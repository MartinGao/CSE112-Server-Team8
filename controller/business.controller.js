/**
 * Created by besin on 2/26/2016.
 */
import mongoose from 'mongoose';
var Business = mongoose.model('Business');

export function newBusiness(req, res, next) {
    var missing = [];

    if (!req.body.name)
        missing.push("missing name");
    if (!req.body.url)
        missing.push("missing url");
    if (!req.body.owner)
        missing.push("missing owner");
    if (missing.length) {
        return res.status(400).send({
            "Error": missing.join(', ')
        });
    }

    Business.findOne({name: req.body.name}).exec(function(err, business) {
        if (err)
            return res.status(400).send(err);
        if (business) {
            business.url = req.body.url;
            business.logo = req.body.logo || null;
            business.description = req.body.description || null;
            business.owner = req.body.owner;
            business.save(function(err, updatedVisitor) {
                if (err)
                    return res.status(400).send(err);
                return res.status(200).send(updatedVisitor);
            });
        }
    });

    var newBusiness = new Business();
    newBusiness.name = req.body.name;
    newBusiness.url = req.body.url;
    newBusiness.logo = req.body.logo || null;
    newBusiness.description = req.body.description || null;
    newBusiness.owner = req.body.owner;
    newBusiness.save(function(err, updatedBusiness) {
        if (err)
            return res.status(400).send(err);
        return res.status(200).send(updatedBusiness);
    });
}

export function _search(req, res, next) {

}