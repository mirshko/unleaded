import { BigNumber } from "bignumber.js";

BigNumber.config({ EXPONENTIAL_AT: 50 });

export const big = val => new BigNumber(val);

export const gweiToEth = val => big(val).times(21000 / 1e9);

export const ethToCurrency = (val, currency) => big(val) * big(currency);

export const formatCurrency = (raw, currency) =>
  ethToCurrency(gweiToEth(big(raw)), currency)
    .toFixed(3)
    .toString();

export const currencies = {
  USD: {
    symbol: "$",
    name: "USD"
  },
  EUR: {
    symbol: "€",
    name: "EUR"
  },
  GBP: {
    symbol: "£",
    name: "GBP"
  },
  CAD: {
    symbol: `$`,
    name: `CAD`
  },
  CNY: {
    symbol: `¥`,
    name: `CNY`
  }
};

export const loadConfig = config =>
  config !== null && config != undefined ? true : false;

export const formatTime = time =>
  time < 60 ? `~${time} secs` : `~${(time / 60).toFixed(1)} mins`;
