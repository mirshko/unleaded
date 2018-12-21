import React from "react";
import {
  Text,
  View,
  ActivityIndicator,
  ActionSheetIOS,
  Linking,
  Image
} from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import store from "react-native-simple-store";
import { Ionicons } from "@expo/vector-icons";

import Container from "./components/Container";
import RefreshSwiper from "./components/RefreshSwiper";
import TouchableHaptic from "./components/TouchableHaptic";
import Pane from "./components/Pane";
import Billboard from "./components/Billboard";

import constants from "./styles/constants";

import {
  formatGwei,
  formatCurrency,
  formatTime,
  currencies,
  loadConfig
} from "./helpers";

const gasEndpoint = `https://ethgasstation.info/json/ethgasAPI.json`;
const ethEndpoint = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR,GBP`;
const API_KEY = `8703745dd362001992299bdd13f73d728341894653cb592d4b070bb793c4600c`;

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hasErrored: false,
      showGasInCurrency: false,
      nativeCurrency: "USD",
      refreshing: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    this.fetchData().then(() => {
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

  fetchData() {
    return fetch(gasEndpoint)
      .then(res => res.json())
      .then(json => {
        this.setState({ gasData: json });
      })
      .then(() =>
        fetch(ethEndpoint, {
          headers: {
            Authorization: `Apikey ${API_KEY}`
          }
        })
      )
      .then(res => res.json())
      .then(json => {
        this.setState({ ethData: json });
      })
      .catch(error => {
        this.setState({ hasErrored: true });
      });
  }

  toggleGasFormat() {
    this.setState(prevState => {
      store.update("config", {
        showGasInCurrency: !prevState.showGasInCurrency
      });

      return {
        showGasInCurrency: !prevState.showGasInCurrency
      };
    });
  }

  openSettings() {
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
            this.changeCurrency();
            break;
          case 3:
            this.toggleGasFormat();
            break;
        }
      }
    );
  }

  changeCurrency() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "USD", "GBP", "EUR"],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 1:
            this.setState({ nativeCurrency: "USD" });
            store.update("config", { nativeCurrency: "USD" });
            break;
          case 2:
            this.setState({ nativeCurrency: "GBP" });
            store.update("config", { nativeCurrency: "GBP" });
            break;
          case 3:
            this.setState({ nativeCurrency: "EUR" });
            store.update("config", { nativeCurrency: "EUR" });
            break;
        }
      }
    );
  }

  handleRefresh = () => {
    this.setState({ refreshing: true });

    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  };

  render() {
    if (this.state.hasErrored || this.state.isLoading) {
      return (
        <Container>
          <Pane>
            {this.state.hasErrored && <Text>⚠️</Text>}
            {this.state.isLoading && <ActivityIndicator size="large" />}
          </Pane>
        </Container>
      );
    }

    const {
      fast,
      safeLow,
      average,
      safeLowWait,
      avgWait,
      fastWait
    } = this.state.gasData;

    const locale = this.state.nativeCurrency;

    const gasSpeeds = [
      {
        key: "safeLow",
        speed: "Slow",
        gas: safeLow,
        wait: safeLowWait
      },
      {
        key: "average",
        speed: "Average",
        gas: average,
        wait: avgWait
      },
      {
        key: "fast",
        speed: "Fast",
        gas: fast,
        wait: fastWait
      }
    ];

    return (
      <Container>
        {/* HEADER */}
        <Pane
          flex={0}
          justifyContent="space-between"
          flexDirection="row"
          style={{
            marginHorizontal: 12
          }}
        >
          <Pane flex={0} height={40} width={40} />
          <Pane flex={0} height={constants.headerOffset}>
            <Image
              style={{ width: 72, height: 72 }}
              source={require("./images/mascot.png")}
            />
          </Pane>
          <TouchableHaptic onPress={() => this.openSettings()}>
            <Pane flex={0} height={40} width={40}>
              <Ionicons name="ios-more" size={32} />
            </Pane>
          </TouchableHaptic>
        </Pane>

        <RefreshSwiper
          refreshFunc={this.handleRefresh}
          refreshingState={this.state.refreshing}
        >
          {gasSpeeds.map(item => (
            <Pane key={item.key}>
              <Pane
                backgroundColor="transparent"
                style={{ marginBottom: constants.headerOffset }}
              >
                <Pane backgroundColor="transparent">
                  <Text
                    style={{
                      ...human.title1Object,
                      ...sanFranciscoWeights.light
                    }}
                  >
                    {item.speed}
                  </Text>
                </Pane>

                <Pane backgroundColor="transparent">
                  <TouchableHaptic onPress={() => this.toggleGasFormat()}>
                    <Pane flex={0}>
                      <Billboard>
                        {this.state.showGasInCurrency
                          ? `${currencies[locale].symbol}${formatCurrency(
                              item.gas,
                              this.state.ethData[locale]
                            )}`
                          : formatGwei(item.gas)}
                      </Billboard>
                      {!this.state.showGasInCurrency && (
                        <Text style={human.title3}>Gwei</Text>
                      )}
                    </Pane>
                  </TouchableHaptic>
                </Pane>

                <Pane backgroundColor="transparent">
                  <Billboard small>{formatTime(item.wait)}</Billboard>
                </Pane>
              </Pane>
            </Pane>
          ))}
        </RefreshSwiper>
      </Container>
    );
  }
}
