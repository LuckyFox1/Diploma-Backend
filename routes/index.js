'use strict';

module.exports = function (app) {
    app.use(require('./search'));
    app.use(require('./user'));
    app.use(require('./like'));
};