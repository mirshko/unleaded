import React, { useState } from "react";
import {
  ActivityIndicator,
  AppState,
  AppStateStatus,
  View,
} from "react-native";
import { SWRConfig } from "swr";
import Caps from "./components/Caps";
import Container from "./components/Container";
import Divider from "./components/Divider";
import FeeEstimate from "./components/FeeEstimate";
import GasSpeed from "./components/GasSpeed";
import Gutter from "./components/Gutter";
import Guzzler from "./components/Guzzler";
import Header from "./components/Header";
import Pane from "./components/Pane";
import RefreshSwiper from "./components/RefreshSwiper";
import Title from "./components/Title";
import constants from "./constants";
import {
  useETHPrice,
  useFeeEstimate,
  useGasData,
  useGuzzlersData,
} from "./hooks";

const App = () => {
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

  const {
    data: feeEstimate,
    mutate: feeEstimateMutate,
    error: feeEstimateError,
  } = useFeeEstimate();

  const isLoading = Boolean(
    typeof gasData === "undefined" ||
      typeof guzzlerData === "undefined" ||
      typeof ethData === "undefined" ||
      typeof feeEstimate === "undefined"
  );

  const isError = Boolean(
    gasDataError || guzzlerDataError || ethPriceError || feeEstimateError
  );

  const [isRefreshing, isRefreshingSet] = useState(false);

  async function handleRefresh() {
    isRefreshingSet(true);

    await Promise.all([
      gasDataMutate(),
      guzzlerDataMutate(),
      ethPriceMutate(),
      feeEstimateMutate(),
    ]);

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
        <FeeEstimate />

        <Divider mb={constants.spacing.xlarge} mt={constants.spacing.xlarge} />

        <Gutter>
          <View style={{ marginBottom: constants.spacing.xlarge }}>
            <Title>Gas Prices</Title>
            <Caps>By Cost (Legacy)</Caps>
          </View>
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
            <Title>Gas Burners</Title>
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

        const onAppStateChange = (nextAppState: AppStateStatus) => {
          if (
            appState.match(/inactive|background/) &&
            nextAppState === "active"
          ) {
            callback();
          }
          appState = nextAppState;
        };

        AppState.addEventListener("change", onAppStateChange);

        return () => {
          AppState.removeEventListener("change", onAppStateChange);
        };
      },
    }}
  >
    <App />
  </SWRConfig>
);

export default AppWrapper;
