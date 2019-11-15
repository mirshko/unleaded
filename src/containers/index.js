import { useState, useEffect, use } from "react";
import { createContainer } from "unstated-next";
import { ActionSheetIOS, Alert } from "react-native";
import store from "react-native-simple-store";

import { loadConfig } from "../helpers";

const gasEndpoint = `https://ethereum-api.xyz/gas-prices`;
const ethEndpoint = `https://ethereum-api.xyz/eth-prices`;
const guzzlersEndpoint = `https://ethereum-api.xyz/gas-guzzlers`;

const currencyOptionArray = ["USD", "GBP", "EUR", "CAD", "CNY", "RON", "JPY"];

const useApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasErrored, setHasErrored] = useState(false);
  const [refreshing, setIsRefreshing] = useState(false);

  const [gasData, setGasData] = useState({});
  const [ethData, setEthData] = useState({});
  const [guzzlerData, setGuzzlerData] = useState({});

  const [showGasInCurrency, toggleShowGasInCurrency] = useState(false);
  const [nativeCurrency, setNativeCurrency] = useState("USD");

  useEffect(() => {
    const bootApp = async () => {
      await restoreUserConfig();

      await fetchData();

      setIsLoading(false);
    };

    bootApp();
  }, []);

  const handleShowGasInCurrency = async () => {
    toggleShowGasInCurrency(!showGasInCurrency);

    await store.update("config", {
      showGasInCurrency: !showGasInCurrency
    });
  };

  const restoreUserConfig = async () => {
    try {
      const config = await store.get("config");

      if (loadConfig(config)) {
        toggleShowGasInCurrency(config.showGasInCurrency || showGasInCurrency);

        setNativeCurrency(config.nativeCurrency || nativeCurrency);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await fetchData();

    setIsRefreshing(false);
  };

  const handleChangeCurrency = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", ...currencyOptionArray],
        cancelButtonIndex: 0
      },
      async buttonIndex => {
        if (buttonIndex > 0) {
          setIsLoading(true);

          const selectedCurrency = currencyOptionArray[buttonIndex - 1];

          setNativeCurrency(selectedCurrency);

          await store.update("config", {
            nativeCurrency: selectedCurrency
          });

          await fetchData();

          setIsLoading(false);
        }
      }
    );
  };

  const handleError = () =>
    Alert.alert(
      "Unable To Load Data",
      "Ethereum and gas data can not be loaded at this time.",
      [
        {
          text: "Reload",
          onPress: async () => {
            setIsLoading(true);
            setHasErrored(false);

            await fetchData();

            setIsLoading(false);
          }
        }
      ]
    );

  const fetchData = async () => {
    let fiat;

    const config = await store.get("config");

    loadConfig(await config)
      ? (fiat = await config.nativeCurrency)
      : (fiat = nativeCurrency);

    try {
      const gasResponse = await fetch(gasEndpoint);
      const gasResponseJson = await gasResponse.json();

      setGasData(await gasResponseJson.result);

      const ethPriceResponse = await fetch(`${ethEndpoint}?fiat=${fiat}`);
      const ethPriceResponseJson = await ethPriceResponse.json();

      setEthData(await ethPriceResponseJson.result);

      const guzzlerResponse = await fetch(guzzlersEndpoint);
      const guzzlerResponseJson = await guzzlerResponse.json();

      setGuzzlerData(await guzzlerResponseJson.result);
    } catch (error) {
      console.error(error);

      setHasErrored(true);
      handleError();
    }

    return Promise.resolve();
  };

  return {
    isLoading,
    hasErrored,
    refreshing,

    gasData,
    ethData,
    guzzlerData,

    handleChangeCurrency,
    handleRefresh,

    showGasInCurrency,
    handleShowGasInCurrency,
    nativeCurrency
  };
};

let AppContainer = createContainer(useApp);

export { AppContainer };
