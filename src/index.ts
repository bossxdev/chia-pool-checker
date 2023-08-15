/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import * as cronJob from "node-cron";
import * as dotenv from "dotenv";
dotenv.config();

import { AppConfig } from "./constants/Constants";
import { getMiningIncome } from "./util/Hpool";
import { sendLineNotify } from "./util/LineNotify";
import { getPriceMarketCap } from "./util/MarketCap";

const runTask = async () => {
  try {
    const pricevalue = await getPriceMarketCap("dogecoin");
    let marketPrice = parseFloat(
      pricevalue
        .replace(/[฿]/g, () => "")
        .replace(/[$]/g, () => "")
        .replace(/[,]/g, () => "")
    );

    const miningIncome = await getMiningIncome(marketPrice);

    if (Boolean(AppConfig.ENABLE_LINE_NOTIFY))
      await sendLineNotify(`${miningIncome}`);
  } catch (error: any) {
    console.log("Error:" + error.message);
  }
};

const jobs = [
  // {
  //   pattern: "30 08 * * *",
  //   message: "Recheck hpool 08:30",
  // },
  // {
  //   pattern: "35 10 * * *",
  //   message: "Recheck hpool in 10:35",
  // },
  {
    pattern: "0 12 * * *",
    message: "Recheck hpool in 12:00",
  },
  {
    pattern: "0 18 * * *",
    message: "Recheck hpool 18:00",
  },
  // {
  //   pattern: "0 22 * * *",
  //   message: "Recheck hpool 22:00",
  // },
];

console.log("Add task");
jobs.forEach((job, index) => {
  console.log(`[+${index}] <<${job.pattern}>> - ${job.message}`);
  cronJob
    .schedule(job.pattern, () => {
      console.log(job.message);
      runTask();
    })
    .start();
});
console.log("Task Started");

runTask();
