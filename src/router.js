var Controller = require('./controller');

module.exports = {
    handle(route) {
        var routeName = route + 'Route';

        Controller[routeName]();
    }
};
