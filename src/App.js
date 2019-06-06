import React, { useState } from "react";
import {
  Text,
  ActivityIndicator,
  ActionSheetIOS,
  Alert,
  View,
  Clipboard,
  NetInfo
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as MailComposer from "expo-mail-composer";
import { human, sanFranciscoWeights } from "react-native-typography";
import store from "react-native-simple-store";
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

import constants, { feedbackTemplate } from "./constants";

import {
  big,
  formatCurrency,
  formatTime,
  currencies,
  loadConfig
} from "./helpers";

const gasEndpoint = `https://ethereum-api.xyz/gas-prices`;
const ethEndpoint = `https://ethereum-api.xyz/eth-prices`;
const guzzlersEndpoint = `https://ethereum-api.xyz/gas-guzzlers`;

const EthereumPrice = ({ nativeCurrency, ethData }) => {
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

const GasSpeed = ({ speed, wait, gas, nativeCurrency, ethData, ...rest }) => {
  const [showGasInCurrency, toggleGasFormat] = useState(true);

  const symbol = currencies[nativeCurrency].symbol;
  const gasInCurrency = formatCurrency(gas, ethData[nativeCurrency]);

  return (
    <Pane flex={1} flexDirection="row" justifyContent="space-between" {...rest}>
      <Pane flex={0} alignItems="flex-start" height={32}>
        <Text style={human.title2}>{speed}</Text>
      </Pane>

      <Pane flex={0}>
        <TouchableHaptic onPress={() => toggleGasFormat(!showGasInCurrency)}>
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

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isConnected: true,
      hasErrored: false,
      showGasInCurrency: false,
      showEthCurrencyValue: true,
      nativeCurrency: "USD",
      refreshing: false
    };
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this._handleConnectivityChange
    );

    this._restoreLastRefreshFromCache();

    store.get("config").then(config => {
      if (loadConfig(config))
        this.setState(prevState => ({
          showGasInCurrency:
            config.showGasInCurrency || prevState.showGasInCurrency,
          nativeCurrency: config.nativeCurrency || prevState.nativeCurrency
        }));

      return;
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this._handleConnectivityChange
    );
  }

  _restoreLastRefreshFromCache() {
    store.get("cache").then(cache => {
      if (loadConfig(cache)) {
        this.setState(
          prevState => ({
            gasData: cache.gasData || prevState.gasData,
            ethData: cache.ethData || prevState.ethData,
            guzzlerData: cache.guzzlerData || prevState.guzzlerData
          }),
          () => this.setState({ isLoading: false })
        );
      } else {
        this._fetchData().then(() => {
          this.setState({ isLoading: false });
        });
      }
    });
  }

  _handleConnectivityChange = isConnected => this.setState({ isConnected });

  async _fetchData() {
    if (this.state.isConnected) {
      try {
        const gasResponse = await fetch(gasEndpoint);
        const gasResponseJson = await gasResponse.json();
        this.setState({ gasData: gasResponseJson.result });

        const ethPriceResponse = await fetch(
          `${ethEndpoint}?fiat=${this.state.nativeCurrency}`
        );
        const ethPriceResponseJson = await ethPriceResponse.json();
        this.setState({ ethData: ethPriceResponseJson.result });

        const guzzlerResponse = await fetch(guzzlersEndpoint);
        const guzzlerResponseJson = await guzzlerResponse.json();
        this.setState({ guzzlerData: guzzlerResponseJson.result });

        return await store.update("cache", {
          gasData: this.state.gasData,
          ethData: this.state.ethData,
          guzzlerData: this.state.guzzlerData.slice(0, 10)
        });
      } catch (error) {
        this.setState({ hasErrored: true });
        this._handleError();
      }
    }

    return Promise.resolve();
  }

  _toggleGasFormat() {
    this.setState(prevState => {
      store.update("config", {
        showGasInCurrency: !prevState.showGasInCurrency
      });

      return {
        showGasInCurrency: !prevState.showGasInCurrency
      };
    });
  }

  _sendFeedback() {
    MailComposer.composeAsync({
      recipients: ["unleaded@reiner.design"],
      subject: "Unleaded Feedback",
      body: feedbackTemplate
    }).catch(() =>
      Alert.alert("Unable To Send Feedback", undefined, [
        {
          text: "Copy feedback email",
          onPress: () => {
            Clipboard.setString("unleaded@reiner.design");
          }
        },
        {
          text: "OK"
        }
      ])
    );
  }

  _handleError() {
    Alert.alert(
      "Unable To Load Data",
      "Ethereum and gas data can not be loaded at this time.",
      [
        {
          text: "Reload",
          onPress: () => {
            this.setState({ isLoading: true, hasErrored: false });

            this._fetchData().then(() => {
              this.setState({ isLoading: false });
            });
          }
        }
      ]
    );
  }

  _openSettings() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          "Cancel",
          "About",
          "Leave feedback",
          "Change your currency",
          `${
            this.state.showGasInCurrency
              ? "Show gas in Gwei"
              : "Show gas in currency"
          }`
        ],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 1:
            WebBrowser.openBrowserAsync(`https://unleaded.reiner.design/`);
            break;
          case 2:
            this._sendFeedback();
            break;
          case 3:
            this._changeCurrency();
            break;
          case 4:
            this._toggleGasFormat();
            break;
        }
      }
    );
  }

  _changeCurrency() {
    const currencyOptionArray = ["USD", "GBP", "EUR", "CAD", "CNY"];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", ...currencyOptionArray],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        if (buttonIndex > 0) {
          const selectedCurrency = currencyOptionArray[buttonIndex - 1];

          this.setState({ nativeCurrency: selectedCurrency });

          store.update("config", { nativeCurrency: selectedCurrency });

          this._handleHardRefresh();
        }
      }
    );
  }

  _handleHardRefresh() {
    this.setState({ isLoading: true });

    this._fetchData().then(() => {
      this.setState({ isLoading: false });
    });
  }

  _handleRefresh() {
    this.setState({ refreshing: true });

    this._fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  render() {
    if (this.state.hasErrored || this.state.isLoading) {
      return (
        <Container>
          <Header action={() => this._openSettings()} />

          <Pane style={{ marginBottom: constants.headerOffset }}>
            {this.state.isLoading && <ActivityIndicator size="large" />}
          </Pane>
        </Container>
      );
    }

    const { fast, average, slow } = this.state.gasData;

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
        <Header action={() => this._openSettings()} />

        <Pane flex={0}>
          <EthereumPrice
            nativeCurrency={this.state.nativeCurrency}
            ethData={this.state.ethData}
          />
        </Pane>

        <Divider mt={24} />

        <RefreshSwiper
          refreshFunc={() => this._handleRefresh()}
          refreshingState={this.state.refreshing}
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
                  nativeCurrency={this.state.nativeCurrency}
                  ethData={this.state.ethData}
                  style={{ marginBottom: index !== gasSpeeds.length - 1 && 16 }}
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
            {this.state.guzzlerData.slice(0, 10).map((guzzler, index) => (
              <Guzzler key={index} {...guzzler} />
            ))}
          </Gutter>
        </RefreshSwiper>
      </Container>
    );
  }
}
