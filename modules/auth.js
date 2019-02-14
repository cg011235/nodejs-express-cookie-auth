"use strict";

module.exports = (req, res, next) => {
    if (!req.signedCookies.user) {
        let authHeader = req.headers.authorization;
        if (!authHeader) {
            let err = new Error('Authentication failed!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
            return;
        }
        let auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        let user = auth[0];
        let pass = auth[1];
        if (user === 'admin' && pass === 'password') {
            res.cookie('user','admin',{signed: true});
            next(); // authorized
        } else {
            let err = new Error('Authentication failed!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            next(err);
        }
    } else {
        if (req.signedCookies.user === 'admin') {
            next();
        } else {
            let err = new Error('Authentication failed!');
            err.status = 401;
            next(err);
        }
    }
};
