import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator
} from "react-native";
import { human } from "react-native-typography";

import Header from "./components/Header";

import { toGwei, gweiToEth, ethToUsd } from "./helpers";

const endpoint = `https://ethgasstation.info/json/ethgasAPI.json`;

export const Wrapper = children => (
  <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, hasErrored: false };
  }

  componentDidMount() {
    return fetch(endpoint)
      .then(res => res.json())
      .then(json => {
        this.setState(
          {
            isLoading: false,
            data: json
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

    const gwei = toGwei(this.state.data.average);
    const eth = gweiToEth(gwei);
    const usd = ethToUsd(eth);

    return (
      <Wrapper>
        <Header />
        <View style={styles.container}>
          <Text style={human.largeTitle}>Gwei {gwei}</Text>
          <Text style={human.largeTitle}>ETH {eth}</Text>
          <Text style={human.largeTitle}>USD {usd}</Text>
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
