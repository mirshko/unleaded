import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import Header from "./components/Header";
import Container from "./components/Container";
import RefreshSwiper from "./components/RefreshSwiper";
import Pane from "./components/Pane";
import Divider from "./components/Divider";
import Caps from "./components/Caps";
import Title from "./components/Title";
import Gutter from "./components/Gutter";
import Guzzler from "./components/Guzzler";
import GasSpeed from "./components/GasSpeed";
import EthereumPrice from "./components/EthereumPrice";

import constants from "./constants";

import { AppContainer } from "./containers";

const App = () => {
  const data = AppContainer.useContainer();

  if (data.hasErrored || data.isLoading)
    return (
      <Container>
        <Header />

        <Pane style={{ marginBottom: constants.headerOffset }}>
          {data.isLoading && <ActivityIndicator size="large" />}
        </Pane>
      </Container>
    );

  const { fast, average, slow } = data.gasData;
  const gasSpeeds = [
    {
      key: "fast",
      speed: "Fast",
      gas: fast.price,
      wait: fast.time
    },
    {
      key: "average",
      speed: "Average",
      gas: average.price,
      wait: average.time
    },
    {
      key: "safeLow",
      speed: "Slow",
      gas: slow.price,
      wait: slow.time
    }
  ];

  return (
    <Container>
      <Header />

      <Pane flex={0}>
        <EthereumPrice />
      </Pane>

      <Divider mt={constants.spacing.xlarge} />

      <RefreshSwiper
        refreshFunc={() => data.handleRefresh()}
        refreshingState={data.refreshing}
      >
        <Gutter>
          <Pane
            flex={0}
            alignItems="unset"
            justifyContent="unset"
            style={{
              marginBottom: constants.spacing.xlarge,
              marginTop: constants.spacing.xlarge
            }}
          >
            <Title>Gas Speeds</Title>
            <Caps>By Cost</Caps>
          </Pane>
        </Gutter>

        <Gutter>
          {gasSpeeds.map((item, index) => (
            <React.Fragment key={index}>
              <GasSpeed
                {...item}
                style={{
                  marginBottom:
                    index !== gasSpeeds.length - 1 && constants.spacing.large
                }}
              />
              {index !== gasSpeeds.length - 1 && (
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
          {data.guzzlerData.slice(0, 10).map((guzzler, index) => (
            <Guzzler key={index} {...guzzler} />
          ))}
        </Gutter>
      </RefreshSwiper>
    </Container>
  );
};

const AppWrapper = () => (
  <AppContainer.Provider>
    <App />
  </AppContainer.Provider>
);

export default AppWrapper;
