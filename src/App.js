import React, { useState, useEffect } from "react";
import { Text, ActivityIndicator, ActionSheetIOS, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { human, sanFranciscoWeights } from "react-native-typography";
import truncateMiddle from "truncate-middle";

import Header from "./components/Header";
import Container from "./components/Container";
import RefreshSwiper from "./components/RefreshSwiper";
import TouchableHaptic from "./components/TouchableHaptic";
import Pane from "./components/Pane";
import Divider from "./components/Divider";
import Pill from "./components/Pill";
import Caps from "./components/Caps";
import Title from "./components/Title";
import Gutter from "./components/Gutter";
import AddressIcon from "./components/AddressIcon";

import constants from "./constants";
import { AppContainer } from "./containers";

import { big, formatCurrency, formatTime, currencies } from "./helpers";

const EthereumPrice = () => {
  const { nativeCurrency, ethData } = AppContainer.useContainer();

  const [toggle, setToggle] = useState(true);

  return (
    <TouchableHaptic onPress={() => setToggle(!toggle)}>
      <Text
        style={{
          ...human.largeTitleObject,
          ...sanFranciscoWeights.black,
          marginTop: 24
        }}
      >
        {toggle
          ? `${currencies[nativeCurrency].symbol}${big(
              ethData[nativeCurrency]
            ).toFixed(2)}`
          : `1 ETH`}
      </Text>
    </TouchableHaptic>
  );
};

const Guzzler = ({ address, pct, ...rest }) => {
  const viewAddress = address => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "View on Alethio", "View on Etherscan"],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 1:
            WebBrowser.openBrowserAsync(`https://aleth.io/account/${address}`);
            break;
          case 2:
            WebBrowser.openBrowserAsync(
              `https://etherscan.io/address/${address}`
            );
            break;
        }
      }
    );
  };

  return (
    <View style={{ marginBottom: 16 }} {...rest}>
      <TouchableHaptic onPress={() => viewAddress(address)}>
        <Pane flexDirection="row" justifyContent="space-between" height={32}>
          <Pane flexDirection="row" flex={0}>
            <AddressIcon address={address} />
            <Text style={human.body}>
              {truncateMiddle(address, 10, 4, "…")}
            </Text>
          </Pane>

          <Pill small>{pct.toFixed(2)}%</Pill>
        </Pane>
      </TouchableHaptic>
    </View>
  );
};

const GasSpeed = ({ speed, wait, gas, ...rest }) => {
  const {
    nativeCurrency,
    ethData,
    showGasInCurrency,
    toggleShowGasInCurrency
  } = AppContainer.useContainer();

  const symbol = currencies[nativeCurrency].symbol;
  const gasInCurrency = formatCurrency(gas, ethData[nativeCurrency]);

  return (
    <Pane flex={1} flexDirection="row" justifyContent="space-between" {...rest}>
      <Pane flex={0} alignItems="flex-start" height={32}>
        <Text style={human.title2}>{speed}</Text>
      </Pane>

      <Pane flex={0}>
        <TouchableHaptic
          onPress={() => toggleShowGasInCurrency(!showGasInCurrency)}
        >
          <Pane flex={0} flexDirection="row">
            <Pill style={{ marginRight: 8 }}>{formatTime(wait)}</Pill>

            <Pill>
              {showGasInCurrency ? `${symbol}${gasInCurrency}` : `${gas} Gwei`}
            </Pill>
          </Pane>
        </TouchableHaptic>
      </Pane>
    </Pane>
  );
};

const App = () => {
  const data = AppContainer.useContainer();

  useEffect(() => {
    data.restoreUserConfig();
    data.restoreLastRefreshFromCache();
  }, []);

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

      <Divider mt={24} />

      <RefreshSwiper
        refreshFunc={() => data.handleRefresh()}
        refreshingState={data.refreshing}
      >
        <Gutter>
          <Pane
            flex={0}
            alignItems="unset"
            justifyContent="unset"
            style={{ marginBottom: 24, marginTop: 24 }}
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
                  marginBottom: index !== gasSpeeds.length - 1 && 16
                }}
              />
              {index !== gasSpeeds.length - 1 && <Divider mb={16} />}
            </React.Fragment>
          ))}
        </Gutter>

        <Divider mb={24} mt={24} />

        <Gutter>
          <View style={{ marginBottom: 24 }}>
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
