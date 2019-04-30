import React from "react";
import {
  Text,
  ActivityIndicator,
  ActionSheetIOS,
  Linking,
  Alert,
  View
} from "react-native";
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

import constants from "./styles/constants";

import { formatCurrency, formatTime, currencies, loadConfig } from "./helpers";
import AddressIcon from "./components/AddressIcon";

const gasEndpoint = `https://ethereum-api.xyz/gas-prices`;
const ethEndpoint = `https://ethereum-api.xyz/eth-prices`;
const guzzlersEndpoint = `https://ethereum-api.xyz/gas-guzzlers`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hasErrored: false,
      showGasInCurrency: false,
      showEthCurrencyValue: true,
      nativeCurrency: "USD",
      refreshing: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    this._fetchData().then(() => {
      this.setState({ isLoading: false });
    });

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

  _fetchData() {
    return fetch(gasEndpoint)
      .then(res => res.json())
      .then(json => {
        this.setState({ gasData: json.result });
      })
      .then(() => fetch(`${ethEndpoint}?fiat=${this.state.nativeCurrency}`))
      .then(res => res.json())
      .then(json => {
        this.setState({ ethData: json.result });
      })
      .then(() => fetch(guzzlersEndpoint))
      .then(res => res.json())
      .then(json => {
        this.setState({ guzzlerData: json.result });
      })
      .catch(error => {
        this.setState({ hasErrored: true });
        this._handleError();
      });
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
      ],
      { cancelable: false }
    );
  }

  _openSettings() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          "Cancel",
          "About",
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
            Linking.openURL(
              `https://github.com/mirshko/unleaded/blob/master/README.md`
            );
            break;
          case 2:
            this._changeCurrency();
            break;
          case 3:
            this._toggleGasFormat();
            break;
        }
      }
    );
  }

  _viewAddress(address) {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "View on EthStats", "View on Etherscan"],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 1:
            Linking.openURL(`https://ethstats.io/account/${address}`);
            break;
          case 2:
            Linking.openURL(`https://etherscan.io/address/${address}`);
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

    const { slow, average, fast } = this.state.gasData;

    const gasSpeeds = [
      {
        key: "safeLow",
        speed: "Slow",
        gas: slow.price,
        wait: slow.time
      },
      {
        key: "average",
        speed: "Average",
        gas: average.price,
        wait: average.time
      },
      {
        key: "fast",
        speed: "Fast",
        gas: fast.price,
        wait: fast.time
      }
    ];

    return (
      <Container>
        <Header action={() => this._openSettings()} />

        <Pane flex={0}>
          <TouchableHaptic
            onPress={() =>
              this.setState(prevState => ({
                showEthCurrencyValue: !prevState.showEthCurrencyValue
              }))
            }
          >
            <Text
              style={{
                ...human.largeTitleObject,
                ...sanFranciscoWeights.black,
                marginTop: 24
              }}
            >
              {this.state.showEthCurrencyValue
                ? `${currencies[this.state.nativeCurrency].symbol}${
                    this.state.ethData[this.state.nativeCurrency]
                  }`
                : `1 ETH`}
            </Text>
          </TouchableHaptic>
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
            {gasSpeeds.reverse().map((item, index) => (
              <React.Fragment key={item.key}>
                <Pane
                  flex={1}
                  flexDirection="row"
                  justifyContent="space-between"
                  style={{ marginBottom: index !== gasSpeeds.length - 1 && 16 }}
                >
                  <Pane flex={0} alignItems="flex-start" height={32}>
                    <Text style={human.title2}>{item.speed}</Text>
                  </Pane>

                  <Pane flex={0}>
                    <TouchableHaptic onPress={() => this._toggleGasFormat()}>
                      <Pane flex={0} flexDirection="row">
                        <Pill style={{ marginRight: 8 }}>
                          {formatTime(item.wait)}
                        </Pill>

                        <Pill>
                          {this.state.showGasInCurrency
                            ? `${
                                currencies[this.state.nativeCurrency].symbol
                              }${formatCurrency(
                                item.gas,
                                this.state.ethData[this.state.nativeCurrency]
                              )}`
                            : `${item.gas} Gwei`}
                        </Pill>
                      </Pane>
                    </TouchableHaptic>
                  </Pane>
                </Pane>
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
              <Pane
                key={index}
                flexDirection="row"
                justifyContent="space-between"
                height={32}
                style={{ marginBottom: 16 }}
              >
                <TouchableHaptic
                  onPress={() => this._viewAddress(guzzler.address)}
                >
                  <Pane flexDirection="row" flex={0}>
                    <AddressIcon address={guzzler.address} />
                    <Text style={human.body}>
                      {truncateMiddle(guzzler.address, 10, 4, "…")}
                    </Text>
                  </Pane>
                </TouchableHaptic>
                <Pill small>{guzzler.pct}%</Pill>
              </Pane>
            ))}
          </Gutter>
        </RefreshSwiper>
      </Container>
    );
  }
}
