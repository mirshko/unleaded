import React from "react";
import {
  Text,
  ActivityIndicator,
  ActionSheetIOS,
  Linking,
  Alert
} from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import store from "react-native-simple-store";

import Header from "./components/Header";
import Container from "./components/Container";
import RefreshSwiper from "./components/RefreshSwiper";
import TouchableHaptic from "./components/TouchableHaptic";
import Pane from "./components/Pane";
import Billboard from "./components/Billboard";

import constants from "./styles/constants";

import { formatCurrency, formatTime, currencies, loadConfig } from "./helpers";

const gasEndpoint = `https://ethereum-api.xyz/gas-prices`;
const ethEndpoint = `https://ethereum-api.xyz/eth-prices?fiat=USD,EUR,GBP,CAD,CNY`;

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
        this.setState({ gasData: json.result });
      })
      .then(() => fetch(ethEndpoint))
      .then(res => res.json())
      .then(json => {
        this.setState({ ethData: json.result });
      })
      .catch(error => {
        this.setState({ hasErrored: true });
        this.handleError();
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

  handleError() {
    Alert.alert(
      "Unable To Load Data",
      "Ethereum and gas data can not be loaded at this time.",
      [
        {
          text: "Reload",
          onPress: () => {
            this.setState({ isLoading: true, hasErrored: false });

            this.fetchData().then(() => {
              this.setState({ isLoading: false });
            });
          }
        }
      ],
      { cancelable: false }
    );
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
    const currencyOptionArray = ["USD", "GBP", "EUR", "CAD", "CNY"];

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", ...currencyOptionArray],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        const selectedCurrency = currencyOptionArray[buttonIndex - 1];

        this.setState({ nativeCurrency: selectedCurrency });
        store.update("config", { nativeCurrency: selectedCurrency });
      }
    );
  }

  handleRefresh() {
    this.setState({ refreshing: true });

    this.fetchData().then(() => {
      this.setState({ refreshing: false });
    });
  }

  render() {
    if (this.state.hasErrored || this.state.isLoading) {
      return (
        <Container>
          <Header action={() => null} />

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
        <Header action={() => this.openSettings()} />

        <RefreshSwiper
          refreshFunc={() => this.handleRefresh()}
          refreshingState={this.state.refreshing}
        >
          {gasSpeeds.map(item => (
            <Pane key={item.key}>
              <Pane style={{ marginBottom: constants.headerOffset }}>
                <Pane>
                  <Text
                    style={{
                      ...human.title1Object,
                      ...sanFranciscoWeights.light
                    }}
                  >
                    {item.speed}
                  </Text>
                </Pane>

                <Pane>
                  <TouchableHaptic onPress={() => this.toggleGasFormat()}>
                    <Pane flex={0}>
                      <Billboard>
                        {this.state.showGasInCurrency
                          ? `${
                              currencies[this.state.nativeCurrency].symbol
                            }${formatCurrency(
                              item.gas,
                              this.state.ethData[this.state.nativeCurrency]
                            )}`
                          : `${item.gas}`}
                      </Billboard>
                      {!this.state.showGasInCurrency && (
                        <Text style={human.title3}>Gwei</Text>
                      )}
                    </Pane>
                  </TouchableHaptic>
                </Pane>

                <Pane>
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
