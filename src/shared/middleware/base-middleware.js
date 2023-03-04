require('dotenv').config();
const Express = require('express');
const app = Express();
const validator = require('validator');

const adminRoutes = [
  '/email-list',
  '/region-avg',
  '/calc-residential'
];

const region = [
  'north',
  'east',
  'south',
  'west'
];

const registerBaseMiddleWare = (app) => {
  app.use(Express.json());
  app.use(logger);
  app.use(checkAuthToken);
  app.use(validateRegion);
};

const logger = (req,res,next) => {
  const message = `API call: ${req.method} on ${req.originalUrl} at ${new Date()}`
  console.log(message);
  next();
};

const checkAuthToken = (req,res,next) => {
  const url = req.url.slice(0,req.url.indexOf('?'));

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

const validateRegion = (req, res, next) => {
  if (req.url !== '/sort-region') {
    next();
    return;
  }

  let flag = 0;
  region.forEach(element => {
    if (validator.equals(req.body.region, element)) {
      flag = 1;
    }
  });

  if (flag == 1) {
    next();
    return;
  }

  res.status(400)
  res.send('Region must be either north or east or south or west');
};

module.exports = {registerBaseMiddleWare};