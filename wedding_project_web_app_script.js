////////////////////////////////////////////////////////////////////////////
/* wedding_project_web_app_script.js                                      */
/* Created by Natsumo Ikeda on 2017/10/09                                 */
/* Copyright 2017 FUJITSU CLOUD TECHNOLOGIES LIMITED All Rights Reserved. */
////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {
    // API KEY
    var applicationKey = "YOUR_NCMB_APPLICATION_KEY";
    var clientKey      = "YOUR_NCMB_CLIENT_KEY";

    // initialize
    var NCMB = require('ncmb');
    var ncmb = new NCMB(applicationKey, clientKey);

    // decode
    var name = decodeURI(req.query.name);
    var message = decodeURI(req.query.message);
    var photoName = decodeURI(req.query.photoName);

    // [mBaaS] save
    var Congratulation = ncmb.DataStore('Congratulation');
    var congratulation = new Congratulation();
    congratulation.set("name", name)
                  .set("message", message)
                  .set("photoName", photoName)
                  .save()
                  .then(function(result){
                      // success
                      res.send(result);
                  })
                  .catch(function(error){
                      // failure
                      res.send(error);
                  });
}
