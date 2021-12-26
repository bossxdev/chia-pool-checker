/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import axios from "axios";
import { AppConfig } from "../constants/Constants";
import { MiningIncome } from "../types/MiningIncome";

const getMiningIncome = async () => {
  let miningIncom: any = {};

  await axios
    .get<MiningIncome>(
      `${AppConfig.API_URL}wallet?address=${AppConfig.AUTH_TOKEN}`
    )
    .then(async (response) => {
      let { currency, unsold, balance, unpaid, paid24h, paidtotal, total } =
        response.data;
      const obj = response.data;
      miningIncom = obj || null;

      while (miningIncom == null) {
        console.log(`currency : ${currency}`);
        console.log(`unsold : ${unsold}`);
        console.log(`balance : ${balance}`);
        console.log(`unpaid : ${unpaid}`);
        console.log(`paid24h : ${paid24h}`);
        console.log(`paidtotal : ${paidtotal}`);
        console.log(`total : ${total}`);

        await axios
          .get<MiningIncome>(
            `${AppConfig.API_URL}wallet?address=${AppConfig.AUTH_TOKEN}`
          )
          .then(async (response) => {
            const obj = response.data;
            if (obj) {
              miningIncom = obj;
            } else {
              miningIncom = null;
            }
          });
      }
    });

  //For Line Notify format
  return `
  
currency : ${miningIncom?.currency}
unsold : ${miningIncom?.unsold}
balance : ${miningIncom?.balance}
unpaid : ${miningIncom?.unpaid}
paid24h : ${miningIncom?.paid24h}
paidtotal : ${miningIncom?.paidtotal}
total : ${miningIncom?.total}
  `;
};

export { getMiningIncome };
