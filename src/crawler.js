// Node Modules
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const TABLE_SELECTOR = 'table#filter--result-table-resumo';
const STORE_FILEPATH = path.resolve(__dirname, '../', process.env.STORE_FILENAME);

class FiiCrawler {
  constructor(url, tableSelector) {
    this.url = url;
    this.tableSelector = tableSelector;
    this.data = this.loadJSON() || null;
  }

  async crawl() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(this.url);

    await page.waitForSelector(this.tableSelector);
    this.data = await page.evaluate((tId) => {
      const table = document.querySelector(tId);
      const priceToFloat = (priceStr) => parseFloat(priceStr.replace(/\./g, '').replace(/,/g, '.'));

      return Array.from(table.querySelectorAll('tbody > tr')).map((tr) => {
        const cols = Array.from(tr.children).map((c) => c.textContent);
        const [pDay, pMonth, pYear] = cols[3].split('/');
        return {
          ticker: cols[0],
          lastYield: priceToFloat(cols[1]),
          lastYieldPercentage: priceToFloat(cols[2]),
          paymentDate: `20${pYear}-${pMonth}-${pDay}`,
          sharePrice: priceToFloat(cols[7]),
        };
      });
    }, this.tableSelector);

    await browser.close();
  }

  saveAsJSON() {
    return new Promise((resolve, reject) =>
      fs.writeFile(STORE_FILEPATH, JSON.stringify(this.data), (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }),
    );
  }

  loadJSON() {
    try {
      return JSON.parse(fs.readFileSync(STORE_FILEPATH, 'utf-8'));
    } catch (err) {
      return null;
    }
  }
}

module.exports = new FiiCrawler(process.env.CRAWL_URL, TABLE_SELECTOR);
