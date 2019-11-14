import { useState, useEffect } from "react";
import { createContainer } from "unstated-next";
import { ActionSheetIOS, Alert } from "react-native";
import store from "react-native-simple-store";

import { loadConfig, currencies } from "../helpers";

const gasEndpoint = `https://ethereum-api.xyz/gas-prices`;
const ethEndpoint = `https://ethereum-api.xyz/eth-prices`;
const guzzlersEndpoint = `https://ethereum-api.xyz/gas-guzzlers`;

const currencyOptionArray = ["USD", "GBP", "EUR", "CAD", "CNY"];

const useApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [hasErrored, setHasErrored] = useState(false);
  const [refreshing, setIsRefreshing] = useState(false);

  const [gasData, setGasData] = useState({});
  const [ethData, setEthData] = useState({});
  const [guzzlerData, setGuzzlerData] = useState({});

  const [showGasInCurrency, toggleShowGasInCurrency] = useState(false);
  const [nativeCurrency, setNativeCurrency] = useState("USD");

  useEffect(() => {
    const boot = async () => {
      console.log("App Booted");

      await restoreUserConfig();

      await fetchData();

      setIsLoading(false);
    };

    boot();
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

      console.log("Config", JSON.stringify(config, null, 2));

      if (loadConfig(config)) {
        toggleShowGasInCurrency(
          (await config.showGasInCurrency) || showGasInCurrency
        );

        setNativeCurrency((await config.nativeCurrency) || nativeCurrency);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHardRefresh = async () => {
    setIsLoading(true);

    await fetchData();

    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);

    await fetchData();

    setIsRefreshing(false);
  };

  const handleCurrencyActionSheetBehavior = async buttonIndex => {
    const selectedCurrency = currencyOptionArray[buttonIndex - 1];

    setNativeCurrency(selectedCurrency);

    await store.update("config", {
      nativeCurrency: selectedCurrency
    });

    handleHardRefresh();
  };

  const handleChangeCurrency = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", ...currencyOptionArray],
        cancelButtonIndex: 0
      },
      buttonIndex =>
        buttonIndex > 0 && handleCurrencyActionSheetBehavior(buttonIndex)
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
    console.log(nativeCurrency, "nativeCurrency");
    console.log(showGasInCurrency, "showGasInCurrency");

    if (isConnected) {
      try {
        const gasResponse = await fetch(gasEndpoint);
        const gasResponseJson = await gasResponse.json();
        setGasData(await gasResponseJson.result);

        const ethPriceResponse = await fetch(
          `${ethEndpoint}?fiat=${nativeCurrency}`
        );
        const ethPriceResponseJson = await ethPriceResponse.json();
        setEthData(await ethPriceResponseJson.result);

        const guzzlerResponse = await fetch(guzzlersEndpoint);
        const guzzlerResponseJson = await guzzlerResponse.json();
        setGuzzlerData(await guzzlerResponseJson.result);
      } catch (error) {
        setHasErrored(true);
        handleError();
      }
    }

    return Promise.resolve();
  };

  return {
    isLoading,
    setIsLoading,

    isConnected,
    setIsConnected,

    hasErrored,
    setHasErrored,

    refreshing,
    setIsRefreshing,

    gasData,
    ethData,
    guzzlerData,

    handleHardRefresh,
    handleChangeCurrency,
    handleRefresh,
    fetchData,

    showGasInCurrency,
    toggleShowGasInCurrency,
    handleShowGasInCurrency,
    nativeCurrency,
    setNativeCurrency,
    restoreUserConfig
  };
};

let AppContainer = createContainer(useApp);

export { AppContainer };
