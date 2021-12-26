/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import axios from "axios";
import { AppConfig } from "../constants/Constants";
import { MiningIncome } from "../types/MiningIncome";

const convert2THB = (price: any, marketPrice: number) => {
  return `${(marketPrice * parseFloat(price)).toFixed(2)} ${AppConfig.CURRENCY}`;
}

const getMiningIncome = async (marketPrice: number) => {
  let miningIncom: any = {};

  console.log(marketPrice)

  await axios
    .get<MiningIncome>(
      `${AppConfig.API_URL}wallet?address=${AppConfig.AUTH_TOKEN}`
    )
    .then(async (response) => {
      const obj = response.data;
      miningIncom = obj || null;

      while (miningIncom == null) {
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
Currency: ${miningIncom?.currency}

- Unpaid: ${miningIncom?.unpaid.toFixed(2)}  (${convert2THB(miningIncom?.unpaid.toFixed(2), marketPrice )})
- Unsold: ${miningIncom?.unsold.toFixed(2)}  (${convert2THB(miningIncom?.unsold.toFixed(2), marketPrice )})
- Balance: ${miningIncom?.balance.toFixed(2)}  (${convert2THB(miningIncom?.balance.toFixed(2), marketPrice )})

- Paid (24H): ${miningIncom?.paid24h.toFixed(2)}  (${convert2THB(miningIncom?.paid24h.toFixed(2), marketPrice )})
- Paid Total: ${miningIncom?.paidtotal.toFixed(2)}  (${convert2THB(miningIncom?.paidtotal.toFixed(2), marketPrice )})

• Total: ${miningIncom?.total.toFixed(2)}  (${convert2THB(miningIncom?.total.toFixed(2), marketPrice )})
  `;
};

export { getMiningIncome };
