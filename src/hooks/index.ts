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

const GAS_ENDPOINT = `${BASE_URL}/api/gas-prices`;

async function getGasData(url: string) {
  const r = await fetch(url);

  const { fastest, fast, average } = await r.json();

  return [
    {
      key: "fastest",
      speed: "Trader",
      gas: fastest.price,
      wait: fastest.time,
    },
    {
      key: "fast",
      speed: "Fast",
      gas: fast.price,
      wait: fast.time,
    },
    {
      key: "average",
      speed: "Standard",
      gas: average.price,
      wait: average.time,
    },
  ];
}

export function useGasData() {
  return useSWR(GAS_ENDPOINT, getGasData);
}

const GUZZLERS_ENDPOINT = `${BASE_URL}/api/gas-guzzlers`;

export function useGuzzlersData() {
  return useSWR(GUZZLERS_ENDPOINT, fetcher);
}

const ETH_ENDPOINT = `${BASE_URL}/api/eth-prices?fiat=`;

export function useETHPrice() {
  const { data: config } = useConfig();

  return useSWR(() => ETH_ENDPOINT + config.nativeCurrency, fetcher);
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
