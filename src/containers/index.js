import { useState } from "react";
import { createContainer } from "unstated-next";
import { ActionSheetIOS, Alert } from "react-native";
import store from "react-native-simple-store";

import { loadConfig } from "../helpers";

const gasEndpoint = `https://ethereum-api.xyz/gas-prices`;
const ethEndpoint = `https://ethereum-api.xyz/eth-prices`;
const guzzlersEndpoint = `https://ethereum-api.xyz/gas-guzzlers`;

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

  const handleShowGasInCurrency = () => {
    toggleShowGasInCurrency(!showGasInCurrency);

    store.update("config", {
      showGasInCurrency: !showGasInCurrency
    });
  };

  const restoreUserConfig = () =>
    store.get("config").then(config => {
      if (loadConfig(config)) {
        toggleShowGasInCurrency(config.showGasInCurrency || showGasInCurrency);
        setNativeCurrency(config.nativeCurrency || nativeCurrency);
      }

      return;
    });

  const handleHardRefresh = () => {
    setIsLoading(true);

    fetchData().then(() => setIsLoading(false));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);

    fetchData().then(() => setIsRefreshing(false));
  };

  const handleChangeCurrency = () => {
    const currencyOptionArray = ["USD", "GBP", "EUR", "CAD", "CNY"];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", ...currencyOptionArray],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex > 0) {
          const selectedCurrency = currencyOptionArray[buttonIndex - 1];

          setNativeCurrency(selectedCurrency);

          store.update("config", { nativeCurrency: selectedCurrency });

          handleHardRefresh();
        }
      }
    );
  };

  const handleError = () => {
    Alert.alert(
      "Unable To Load Data",
      "Ethereum and gas data can not be loaded at this time.",
      [
        {
          text: "Reload",
          onPress: () => {
            setIsLoading(true);
            setHasErrored(false);

            fetchData().then(() => setIsLoading(false));
          }
        }
      ]
    );
  };

  const fetchData = async () => {
    if (isConnected) {
      try {
        const gasResponse = await fetch(gasEndpoint);
        const gasResponseJson = await gasResponse.json();
        setGasData(gasResponseJson.result);

        const ethPriceResponse = await fetch(
          `${ethEndpoint}?fiat=${nativeCurrency}`
        );
        const ethPriceResponseJson = await ethPriceResponse.json();
        setEthData(ethPriceResponseJson.result);

        const guzzlerResponse = await fetch(guzzlersEndpoint);
        const guzzlerResponseJson = await guzzlerResponse.json();
        setGuzzlerData(guzzlerResponseJson.result);

        return await store.update("cache", {
          gasData,
          ethData,
          guzzlerData
        });
      } catch (error) {
        setHasErrored(true);
        handleError();
      }
    }

    return Promise.resolve();
  };

  const restoreLastRefreshFromCache = () => {
    // store.get("cache").then(cache => {
    //   if (loadConfig(cache)) {
    //     setGasData(cache.gasData || gasData);
    //     setEthData(cache.ethData || ethData);
    //     setGuzzlerData(cache.guzzlerData || guzzlerData);

    //     setIsLoading(false);
    //   } else {
    //     fetchData().then(() => setIsLoading(false));
    //   }
    // });
    fetchData().then(() => setIsLoading(false));
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
    restoreLastRefreshFromCache,

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
