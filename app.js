const fs = require("fs")
const lighthouse = require("lighthouse")
const chromeLauncher = require("chrome-launcher")
const url = require('url')

const adrs = fs.readFileSync("Adrs.csv").toString().split("\n");
const strategys = ['mobile', 'desktop'];

(async () => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] })
  const options = {
    // logLevel: "info",
    output: "html",
    port: chrome.port,
  }

  for (adr of adrs) {
    const parsedAdr = url.parse(adr, true);
    for (strategy of strategys) {
      options.strategy = strategy;
      const runnerResult = await lighthouse(adr, options);
      const reportHtml = runnerResult.report;
      fs.writeFileSync(`lh-${parsedAdr.host}-${parsedAdr.pathname.split('/').join('I')}-${strategy}.html`, reportHtml);
    }
  }

  await chrome.kill()
})()





