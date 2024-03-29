const PublicController = require('../features/public/public.controller');

const registerPublicRoutes = (app) => {
  app.post('/contact', PublicController.contactUs);

  app.get('/calc/:buildingtype', PublicController.calculateQuote);

  app.get('/calc-cost', PublicController.calcCost);

  app.get('/agents', PublicController.getAllAgentsResidential);

  app.post('/sort-region', PublicController.sortRegion);
}

module.exports = {registerPublicRoutes};