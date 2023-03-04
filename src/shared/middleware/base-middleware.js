require('dotenv').config();
const Express = require('express');
const app = Express();
const validator = require('validator')

const adminRoutes = [
  '/email-list',
  '/region-avg',
  '/calc-residential'
];

const building_type = [
  'residential',
  'commercial',
  'industrial'
];

const registerBaseMiddleWare = (app) => {
  app.use(Express.json());
  app.use(logger);
  app.use(checkAuthToken);
  app.use(validateBuildingType);
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

const validateBuildingType = (req, res, next) => {
  let url
  const index = req.url.indexOf('/', 2)
  
  if (index == -1) {
    url = req.url;
  } else {
    url = req.url.slice(0, index);
  }
  
  if (url !== '/calc') {
    next();
    return;
  }

  const index2 = req.url.indexOf('?')
  let buildingType = req.originalUrl.slice(index + 1, index2)

  let flag = 0;
  building_type.forEach(element => {
    if (validator.equals(buildingType, element)) {
      flag = 1;
    }
  });
  
  if (flag == 1) {
    next();
    return;
  }

  res.status(400)
  res.send('Building type must be either residential or commercial or industrial');
};

module.exports = {registerBaseMiddleWare};