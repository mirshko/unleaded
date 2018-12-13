import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ActionSheetIOS,
  Linking
} from "react-native";
import { human, sanFranciscoWeights, iOSColors } from "react-native-typography";

import Frame from "./components/Frame";
import TouchableHaptic from "./components/TouchableHaptic";

import { toGwei, gweiToEth, ethToUsd } from "./helpers";

const gasEndpoint = `https://ethgasstation.info/json/ethgasAPI.json`;
const ethEndpoint = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`;
const API_KEY = `8703745dd362001992299bdd13f73d728341894653cb592d4b070bb793c4600c`;

const Gear = () => <Text style={human.largeTitle}>⚙️</Text>;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
    marginBottom: 16
  }
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hasErrored: false,
      showGasInCurrency: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState(
      {
        isLoading: true
      },
      function() {}
    );

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
            ethData: json,
            isLoading: false
          },
          function() {}
        );
      })
      .catch(error => {
        this.setState(
          {
            isLoading: false,
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
          }`,
          "Refresh"
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
          case 3:
            this.fetchData();
            break;
        }
      }
    );
  }

  render() {
    if (this.state.hasErrored || this.state.isLoading) {
      return (
        <Frame>
          <View style={styles.container}>
            {this.state.hasErrored && <Text style={styles.title}>⚠️</Text>}
            {this.state.isLoading && <ActivityIndicator />}
          </View>
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
        <View style={styles.settingsContainer}>
          <TouchableHaptic impact="Light" onPress={() => this.openSettings()}>
            <Gear />
          </TouchableHaptic>
        </View>
      </Frame>
    );
  }
}
