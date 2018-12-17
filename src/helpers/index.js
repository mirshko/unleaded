import { BigNumber } from "bignumber.js";

BigNumber.config({ EXPONENTIAL_AT: 50 });

const big = val => new BigNumber(val);

export const toGwei = val => big((val /= 10));

export const gweiToEth = val => big(val).times(21000 / 1e9);

export const ethToCurrency = (val, currency) => big(val) * big(currency);

export const formatGwei = raw => toGwei(raw).toString();

export const formatCurrency = (raw, currency) =>
  ethToCurrency(gweiToEth(toGwei(raw)), currency)
    .toFixed(3)
    .toString();
