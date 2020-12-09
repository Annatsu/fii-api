// Node Modules
require('dotenv/config');
const cron = require('node-cron');

// Application Modules
const server = require('./src/server');
const Crawler = require('./src/crawler');

// Run every 10 minutes.
cron.schedule('*/10 * * * *', async () => {
  console.log('Attempting to crawl page');
  await Crawler.crawl();
  await Crawler.saveAsJSON();
});

server.initializeServer();
