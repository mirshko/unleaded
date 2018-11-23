import { BigNumber } from "bignumber.js";

BigNumber.config({ EXPONENTIAL_AT: 50 });

const costOfEth = 135.57;

const big = val => new BigNumber(val);

const toGwei = val => big((val /= 10));

const gweiToEth = val => big(val).times(21000 / 1e9);

const ethToUsd = val => big(val) * big(costOfEth);
