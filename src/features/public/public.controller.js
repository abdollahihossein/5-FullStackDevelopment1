const Data = require('../../shared/resources/data');
const Model = require('../../shared/db/mongodb/schemas/contact.Schema');
const Agent = require('../../shared/db/mongodb/schemas/agent.Schema');
const validator = require('validator');

// '/contact'
const contactUs = async(req, res) => {
  try {
    await Model.Contact.create(req.body)
    res.send(req.body)
  } catch (error) {
    res.status(500)
    res.send(error.message)
  }
};

// '/agents'
const getAllAgentsResidential = async(req, res) => {
  const agents = await Agent.find({})
  let count = await Agent.countDocuments({})
  try {
      if (count == 0) {
          res.status(404).send('No item found!')
      }
      else {
          res.send(agents)
      }
  } catch (error) {
      res.status(500).send(error)
  }
};

// '/sort-region'
const sortRegion = async(req, res) => {
  let j = 0
  let filteredData = []
  try {
    req.body.data.forEach(element => {
      if (element.region == req.body.region) {
        filteredData[j] = element
        j++
      }
    });
    res.send(filteredData)
  } catch (error) {
    res.status(500).send(error)
  }
};

// '/calc/:buildingtype'
const calculateQuote = async(req, res) => {
  const buildingType = req.params.buildingtype;
  const apts = req.query.apts;
  const floors = req.query.floors;
  const maxOccupancy = req.query.maxOccupancy;
  const elevators = req.query.elevators;
  let numElevators
  
  if (buildingType == "residential") {
    if(isNaN(floors) || isNaN(apts)){
      res.status(400);
      res.send(`Error: apts and floors must be specified as numbers`);
      return;
    }
    if(!Number.isInteger(Number(floors)) || !Number.isInteger(Number(apts))){
      res.status(400);
      res.send(`Error: apts and floors must be integers`);
      return;
    }
    if(floors < 1 || apts < 1){
      res.status(400);
      res.send(`apts and floors must be greater than zero`);
      return;
    }
    numElevators = calcResidentialElev(floors,apts);
  }

  if (buildingType == "commercial") {
    if(isNaN(floors) || isNaN(maxOccupancy)){
      res.status(400);
      res.send(`Error: floors and maxOccupancy must be specified as numbers`);
      return;
    }
    if(!Number.isInteger(Number(floors)) || !Number.isInteger(Number(maxOccupancy))){
      res.status(400);
      res.send(`Error: floors and maxOccupancy must be integers`);
      return;
    }
    if(floors < 1 || maxOccupancy < 1){
      res.status(400);
      res.send(`floors and maxOccupancy must be greater than zero`);
      return;
    }
    numElevators = calcCommercialElev(floors,maxOccupancy);
  }

  if (buildingType == "industrial") {
    if(isNaN(elevators)){
      res.status(400);
      res.send(`Error: elevators must be specified as number`);
      return;
    }
    if(!Number.isInteger(Number(elevators))){
      res.status(400);
      res.send(`Error: elevators must be integer`);
      return;
    }
    if(elevators < 1){
      res.status(400);
      res.send(`elevators must be greater than zero`);
      return;
    }
    numElevators = elevators;
  }
  res.json(numElevators)
};

// '/calc-cost'
const calcCost = async(req, res) => {
  const numberOfElevators = req.query.numElevators;
  const tier = req.query.tier;
  let unitPrice = Data.unitPrices[tier];
  let subTotal = calcElevfee(numberOfElevators,tier);
  let installFee = calcInstallFee(numberOfElevators,tier);
  let totalCost = subTotal + installFee;
  res.send({
    unit_price: unitPrice,
    sub_total: subTotal,
    install_fee: installFee,
    total_cost: totalCost
  })
};

const calcResidentialElev = (numFloors, numApts) => {
  const elevatorsRequired = Math.ceil(numApts / numFloors / 6)*Math.ceil(numFloors / 20);
  return elevatorsRequired;
};

const calcCommercialElev = (numFloors, maxOccupancy) => {
  const elevatorsRequired = Math.ceil((maxOccupancy * numFloors) / 200)*Math.ceil(numFloors / 10);
  const freighElevatorsRequired = Math.ceil(numFloors / 10);
  return freighElevatorsRequired + elevatorsRequired;
};

const calcElevfee = (numElvs, tier) => {
  const unitPrice = Data.unitPrices[tier];
  const total = numElvs * unitPrice;
  return total;
};

const calcInstallFee = (numElvs, tier) => {
  const unitPrice = Data.unitPrices[tier];
  const installPercentFees = Data.installPercentFees[tier];
  const total = numElvs * unitPrice * installPercentFees / 100;
  return total;
};

module.exports = {contactUs, calculateQuote, calcCost, getAllAgentsResidential, sortRegion};
