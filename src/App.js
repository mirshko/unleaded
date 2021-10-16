import { useKeepAwake } from "expo-keep-awake";
import React, { useState } from "react";
import { ActivityIndicator, AppState, View } from "react-native";
import { SWRConfig } from "swr";
import Caps from "./components/Caps";
import Container from "./components/Container";
import Divider from "./components/Divider";
import GasSpeed from "./components/GasSpeed";
import Gutter from "./components/Gutter";
import Guzzler from "./components/Guzzler";
import Header from "./components/Header";
import Pane from "./components/Pane";
import RefreshSwiper from "./components/RefreshSwiper";
import Title from "./components/Title";
import constants from "./constants";
import { useETHPrice, useGasData, useGuzzlersData } from "./hooks";

const App = () => {
  useKeepAwake();

  const {
    data: gasData,
    mutate: gasDataMutate,
    error: gasDataError,
  } = useGasData();

  const {
    data: guzzlerData,
    mutate: guzzlerDataMutate,
    error: guzzlerDataError,
  } = useGuzzlersData();

  const {
    data: ethData,
    mutate: ethPriceMutate,
    error: ethPriceError,
  } = useETHPrice();

  const isLoading = Boolean(
    typeof gasData === "undefined" ||
      typeof guzzlerData === "undefined" ||
      typeof ethData === "undefined"
  );

  const isError = Boolean(gasDataError || guzzlerDataError || ethPriceError);

  const [isRefreshing, isRefreshingSet] = useState(false);

  async function handleRefresh() {
    isRefreshingSet(true);

    await Promise.all([gasDataMutate(), guzzlerDataMutate(), ethPriceMutate()]);

    isRefreshingSet(false);
  }

  if (isError || isLoading)
    return (
      <Container>
        <Header />

        <Pane style={{ marginBottom: constants.headerOffset }}>
          {isLoading && <ActivityIndicator size="large" />}
        </Pane>
      </Container>
    );

  return (
    <Container>
      <Header />

      <Divider />

      <RefreshSwiper refreshFunc={handleRefresh} refreshingState={isRefreshing}>
        <Gutter>
          <Pane
            flex={0}
            alignItems="unset"
            justifyContent="unset"
            style={{
              marginBottom: constants.spacing.xlarge,
              marginTop: constants.spacing.xlarge,
            }}
          >
            <Title>Gas Speeds</Title>
            <Caps>By Cost</Caps>
          </Pane>
        </Gutter>

        <Gutter>
          {gasData?.map((item, index) => (
            <React.Fragment key={index}>
              <GasSpeed
                {...item}
                ethData={ethData}
                style={{
                  marginBottom:
                    index !== gasData.length - 1 && constants.spacing.large,
                }}
              />
              {index !== gasData.length - 1 && (
                <Divider mb={constants.spacing.large} />
              )}
            </React.Fragment>
          ))}
        </Gutter>

        <Divider mb={constants.spacing.xlarge} mt={constants.spacing.xlarge} />

        <Gutter>
          <View style={{ marginBottom: constants.spacing.xlarge }}>
            <Title>Gas Guzzlers</Title>
            <Caps>By Percent</Caps>
          </View>
        </Gutter>

        <Gutter>
          {guzzlerData.slice(0, 10).map((guzzler, index) => (
            <Guzzler key={index} {...guzzler} />
          ))}
        </Gutter>
      </RefreshSwiper>
    </Container>
  );
};

const AppWrapper = () => (
  <SWRConfig
    value={{
      provider: () => new Map(),
      isVisible: () => {
        return true;
      },
      initFocus(callback) {
        let appState = AppState.currentState;

        const onAppStateChange = (nextAppState) => {
          /* If it's resuming from background or inactive mode to active one */
          if (
            appState.match(/inactive|background/) &&
            nextAppState === "active"
          ) {
            callback();
          }
          appState = nextAppState;
        };

        // Subscribe to the app state change events
        const subscription = AppState.addEventListener(
          "change",
          onAppStateChange
        );

        return () => {
          subscription.remove();
        };
      },
    }}
  >
    <App />
  </SWRConfig>
);

export default AppWrapper;
