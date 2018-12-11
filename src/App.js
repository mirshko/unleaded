import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { human } from "react-native-typography";

import Header from "./components/Header";

import { toGwei, gweiToEth, ethToUsd } from "./helpers";

const gasEndpoint = `https://ethgasstation.info/json/ethgasAPI.json`;

const ethEndpoint = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`;

const API_KEY = `8703745dd362001992299bdd13f73d728341894653cb592d4b070bb793c4600c`;

export const Wrapper = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, hasErrored: false, showGasInUsd: false };
  }

  componentDidMount() {
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

  render() {
    if (this.state.hasErrored) {
      return (
        <Wrapper>
          <Header />
          <View style={styles.container}>
            <Text style={human.largeTitle}>⚠️</Text>
          </View>
        </Wrapper>
      );
    }

    if (this.state.isLoading) {
      return (
        <Wrapper>
          <Header />
          <View style={styles.container}>
            <ActivityIndicator />
          </View>
        </Wrapper>
      );
    }

    const currentCostOfEth = this.state.ethData.USD;

    const rawGasValue = this.state.gasData.average;

    const gwei = toGwei(rawGasValue);

    const usd = ethToUsd(
      gweiToEth(toGwei(rawGasValue)),
      currentCostOfEth
    ).toFixed(3);

    return (
      <Wrapper>
        <Header />
        <View style={styles.container}>
          <TouchableOpacity
            onPressOut={() =>
              this.setState(prevState => ({
                showGasInUsd: !prevState.showGasInUsd
              }))
            }
          >
            <Text style={human.largeTitle}>
              {this.state.showGasInUsd
                ? `$${usd.toString()}`
                : `Gwei ${gwei.toString()}`}
            </Text>
          </TouchableOpacity>
        </View>
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
