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

const runTask = async () => {
  try {
    const miningIncome = await getMiningIncome();
    console.log("miningIncome -->", miningIncome);

    if (Boolean(AppConfig.ENABLE_LINE_NOTIFY))
      await sendLineNotify(`${miningIncome}`);
  } catch (error: any) {
    console.log("Error:" + error.message);
  }
};

const jobs = [
  {
    pattern: "00 08 * * *",
    message: "Recheck hpool 08:00",
  },
  {
    pattern: "00 10 * * *",
    message: "Recheck hpool in 10:00",
  },
  {
    pattern: "0 12 * * *",
    message: "Recheck hpool in 12:00",
  },
  {
    pattern: "0 15 * * *",
    message: "Recheck hpool 15:00",
  },
  {
    pattern: "0 18 * * *",
    message: "Recheck hpool 18:00",
  },
  {
    pattern: "0 0 * * *",
    message: "Recheck hpool 00:00",
  },
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
