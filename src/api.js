// Node Modules
const { Router } = require('express');

// Application Modules
const Crawler = require('./crawler');

const router = new Router();

const filterFunctions = {
  nameContains: (fii, arg) => fii.ticker.includes(arg.toUpperCase()),
  yieldAbove: (fii, arg) => fii.lastYield > arg,
  yieldBelow: (fii, arg) => fii.lastYield < arg,
  yieldPercentageAbove: (fii, arg) => fii.lastYieldPercentage > arg,
  yieldPercentageBelow: (fii, arg) => fii.lastYieldPercentage < arg,
  sharePriceAbove: (fii, arg) => fii.sharePrice > arg,
  sharePriceBelow: (fii, arg) => fii.sharePrice < arg,
};

router.get(`${process.env.API_ENDPOINT}/fii`, (req, res) => {
  let responseResult = Crawler.data;

  if (req.query) {
    const filters = Object.keys(req.query).filter((f) => filterFunctions.hasOwnProperty(f));

    responseResult = Crawler.data.filter((fii) => {
      return filters.every((f) => filterFunctions[f](fii, req.query[f]));
    });
  }

  res.json({ payload: responseResult });
});

router.get(`${process.env.API_ENDPOINT}/fii/:uniqueFiiTicker`, (req, res) => {
  const { uniqueFiiTicker } = req.params;
  const uniqueFii = Crawler.data.find((fii) => fii.ticker === uniqueFiiTicker.toUpperCase());
  res.json({ payload: uniqueFii || null });
});

module.exports = router;
