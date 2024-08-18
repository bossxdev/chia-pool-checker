/*
  # Author : Watchara Pongsri
  # [github/X-c0d3] https://github.com/X-c0d3/
  # Web Site: https://www.rockdevper.com
*/

import axios from 'axios';
import { JSDOM } from 'jsdom';
import { AppConfig } from '../constants/Constants';
const HEADER = {
    timeout: 8000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: `currency=${AppConfig.CURRENCY}`,
    },
};

const getPriceMarketCap = async (currency: string): Promise<string> => {
    let priceValue: string | null = null;
    try {
        const res = await axios.get(`https://coinmarketcap.com/currencies/${currency}/`, HEADER);
        const dom = new JSDOM(res.data);
        const priceElement = dom.window.document.querySelector('span.sc-65e7f566-0.clvjgF.base-text');

        if (priceElement) {
            priceValue = priceElement.textContent;
        } else {
            console.log('Price element not found.');
        }
    } catch (err) {
        console.error('Error fetching price:', err);
    }

    return priceValue ?? 'Price not available';
}

export { getPriceMarketCap }
