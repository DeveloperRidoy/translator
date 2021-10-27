const { translate } = require('../controllers/translate');

const Router = require('express').Router();




Router.route('/')
    .post(translate)  




module.exports = Router;