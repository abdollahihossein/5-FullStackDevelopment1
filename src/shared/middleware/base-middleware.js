require('dotenv').config();
const Express = require('express');
const app = Express();
const validator = require('validator')

const adminRoutes = [
  '/email-list',
  '/region-avg',
  '/calc-residential'
];

const registerBaseMiddleWare = (app) => {
  app.use(Express.json());
  app.use(logger);
  app.use(checkAuthToken);
  app.use(validateContact);
};

const validateContact = (req, res, next) => {
  if (req.url !== '/contact') {
    next();
    return;
  }
  if ((validator.isEmail(req.body.email)) && (validator.isMobilePhone(req.body.phone))) {
    next();
    return;
  }
  res.status(400)
  res.send({message: "email and phone number not validated!",});
}

const logger = (req, res, next) => {
  const message = `API call: ${req.method} on ${req.originalUrl} at ${new Date()}`
  console.log(message);
  next();
};

const checkAuthToken = (req, res, next) => {
  let url
  if (req.url.indexOf('?') == -1) {
    url = req.url;
  } else {
    url = req.url.slice(0,req.url.indexOf('?'));
  }

  if(!adminRoutes.includes(url)){
    next();
    return;
  }

  const inputToken = req.headers.token;
  const savedToken = process.env.TOKEN;

  if(inputToken !== savedToken){
    res.status(401);
    res.send('Unauthorized');
    return;
  }
  next();
};

module.exports = {registerBaseMiddleWare};