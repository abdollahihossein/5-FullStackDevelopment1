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

const validateBuildingType = (req, res, next) => {
  let url
  const index = req.url.indexOf('/', 2)
  if (index == -1) {
    url = req.url;
  } else {
    url = req.url.slice(0, index);
  }

  console.log(url)
  console.log(req.query.floors)
  console.log(req.params.buildingtype)
  
  if (url !== '/calc') {
    next();
    return;
  }
  
  // if (validator.equals(req.params.buildingtype, 'residential')) {
  //   next();
  //   return;
  // }
  res.status(400)
  res.send('building type must be residential or commercial or industrial');
  // next();
}

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

module.exports = {registerBaseMiddleWare};