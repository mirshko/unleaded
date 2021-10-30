import useSWR from "swr";
import { BASE_URL } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function fetcher(...args: [RequestInfo, RequestInit]) {
  const r = await fetch(...args);

  if (r.ok) {
    return r.json();
  }

  throw new Error((await r.json()).error);
}

type GasDataSpeeds = "safeLow" | "average" | "fast" | "fastest";

interface GasData {
  success: boolean;
  result: Record<GasDataSpeeds, Record<"time" | "price", number>>;
}

const GAS_ENDPOINT = `${BASE_URL}/api/2/prices/gas`;

async function getGasData(url: string) {
  const r = await fetch(url);

  const { result }: GasData = await r.json();

  return [
    {
      key: "fastest",
      speed: "Fast",
      gas: result.fast.price,
      wait: result.fast.time,
    },
    {
      key: "safeLow",
      speed: "Standard",
      gas: result.average.price,
      wait: result.average.time,
    },
    {
      key: "safeLow",
      speed: "Safe Low",
      gas: result.safeLow.price,
      wait: result.safeLow.time,
    },
  ];
}

export function useGasData() {
  return useSWR(GAS_ENDPOINT, getGasData);
}

interface FeeEstimate {
  success: boolean;
  result: {
    baseFee: number;
    blockNumber: number;
    blockTime: number;
    gasPrice: {
      fast: number;
      instant: number;
      standard: number;
    };
    nextBaseFee: number;
    priorityFee: {
      fast: number;
      instant: number;
      standard: number;
    };
  };
}

const FEE_ESTIMATE_ENDPOINT = `${BASE_URL}/api/2/prices/fee-estimate`;

export function useFeeEstimate() {
  return useSWR<FeeEstimate>(FEE_ESTIMATE_ENDPOINT, fetcher);
}

const GUZZLERS_ENDPOINT = `${BASE_URL}/api/gas-guzzlers`;

export function useGuzzlersData() {
  return useSWR(GUZZLERS_ENDPOINT, fetcher);
}

const ETH_ENDPOINT = `${BASE_URL}/api/2/prices/eth?fiat=`;

interface ETHPrice {
  success: boolean;
  result: {
    [currency: string]: number;
  };
}

export function useETHPrice() {
  const { data: config } = useConfig();

  return useSWR<ETHPrice>(() => ETH_ENDPOINT + config.nativeCurrency, fetcher);
}

type Config = {
  showGasInCurrency: boolean;
  nativeCurrency: string;
};

async function getConfig(): Promise<Config> {
  try {
    const config = await AsyncStorage.getItem("config");

    if (config) {
      return JSON.parse(config);
    }

    return {
      showGasInCurrency: false,
      nativeCurrency: "USD",
    };
  } catch (error) {
    console.error(error);
  }
}

export function useConfig() {
  return useSWR<Config>("Config", getConfig);
}
