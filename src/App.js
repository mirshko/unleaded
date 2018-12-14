import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  ActionSheetIOS,
  Linking
} from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import { isIphoneX } from "react-native-iphone-x-helper";

import Frame from "./components/Frame";
import TouchableHaptic from "./components/TouchableHaptic";

import { toGwei, gweiToEth, ethToUsd } from "./helpers";

const gasEndpoint = `https://ethgasstation.info/json/ethgasAPI.json`;
const ethEndpoint = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`;
const API_KEY = `8703745dd362001992299bdd13f73d728341894653cb592d4b070bb793c4600c`;

const Gear = () => <Text style={human.largeTitle}>⚙️</Text>;

const Settings = ({ action }) => (
  <View style={styles.settingsContainer}>
    <TouchableHaptic impact="Light" onPress={action}>
      <Gear />
    </TouchableHaptic>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center"
  },
  title: {
    ...human.largeTitleObject,
    ...sanFranciscoWeights.heavy
  },
  settingsContainer: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: !isIphoneX() ? 16 : 0
  }
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hasErrored: false,
      showGasInCurrency: false,
      refreshing: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    this.fetchData().then(() => {
      this.setState({ isLoading: false });
    });
  }

  fetchData() {
    return fetch(gasEndpoint)
      .then(res => res.json())
      .then(json => {
        this.setState(
          {
            gasData: json
          },
          function() {}
        );
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
        this.setState(
          {
            ethData: json
          },
          function() {}
        );
      })
      .catch(error => {
        this.setState(
          {
            hasErrored: true
          },
          function() {}
        );
        console.error(error);
      });
  }

  openSettings() {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          "Cancel",
          "About",
          `${
            this.state.showGasInCurrency
              ? "Show Gas In Gwei"
              : "Show Gas In Currency"
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
            this.setState(prevState => ({
              showGasInCurrency: !prevState.showGasInCurrency
            }));
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
        <Frame>
          <View style={styles.container}>
            {this.state.hasErrored && <Text style={styles.title}>⚠️</Text>}
            {this.state.isLoading && <ActivityIndicator size="large" />}
          </View>
          <Settings action={() => this.openSettings()} />
        </Frame>
      );
    }

    const currentCostOfEth = this.state.ethData;
    const rawAverageGas = this.state.gasData.average;

    const gasInEth = gweiToEth(toGwei(rawAverageGas));

    const gasInGwei = toGwei(rawAverageGas);
    const gasInUsd = ethToUsd(gasInEth, currentCostOfEth.USD).toFixed(3);

    const format = val => val.toString();

    return (
      <Frame>
        <View style={styles.container}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
              />
            }
          >
            <View
              style={{
                minHeight: "100%",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <TouchableHaptic
                onPress={() => {
                  this.setState(prevState => ({
                    showGasInCurrency: !prevState.showGasInCurrency
                  }));
                }}
              >
                <Text style={styles.title}>
                  {this.state.showGasInCurrency
                    ? `$${format(gasInUsd)}`
                    : `Gwei ${format(gasInGwei)}`}
                </Text>
              </TouchableHaptic>
            </View>
          </ScrollView>
        </View>

        <Settings action={() => this.openSettings()} />
      </Frame>
    );
  }
}
