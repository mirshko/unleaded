import { BigNumber } from "bignumber.js";

BigNumber.config({ EXPONENTIAL_AT: 50 });

const big = val => new BigNumber(val);

export const toGwei = val => big((val /= 10));

export const gweiToEth = val => big(val).times(21000 / 1e9);

export const ethToUsd = (val, eth) => big(val) * big(eth);
