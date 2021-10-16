import { BigNumber } from "bignumber.js";

BigNumber.config({ EXPONENTIAL_AT: 50 });

export const big = (val: BigNumber.Value) => new BigNumber(val);

export const gweiToEth = (val: BigNumber.Value) => big(val).times(21000 / 1e9);

export const ethToCurrency = (
  val: BigNumber.Value,
  currency: BigNumber.Value
) => big(val).times(currency);

export const formatCurrency = (
  raw: BigNumber.Value,
  currency: BigNumber.Value
) => ethToCurrency(gweiToEth(raw), currency).toFixed(3).toString();

export const currencies = {
  USD: {
    symbol: "$",
    name: "USD",
  },
  EUR: {
    symbol: "€",
    name: "EUR",
  },
  GBP: {
    symbol: "£",
    name: "GBP",
  },
  CAD: {
    symbol: "$",
    name: "CAD",
  },
  CNY: {
    symbol: "¥",
    name: "CNY",
  },
  RON: {
    symbol: "L",
    name: "RON",
  },
  JPY: {
    symbol: "¥",
    name: "JPY",
  },
};

export const formatTime = (time: number) =>
  time < 60 ? `~${time} secs` : `~${(time / 60).toFixed(1)} mins`;

export const truncateAddress = (address: string) =>
  `${address.slice(0, 10)}...${address.slice(address.length - 4)}`;
