import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  FlatList,
  ActionSheetIOS,
  Linking
} from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import { isIphoneX } from "react-native-iphone-x-helper";

import Frame from "./components/Frame";
import TouchableHaptic from "./components/TouchableHaptic";

import { formatGwei, formatCurrency } from "./helpers";

const gasEndpoint = `https://ethgasstation.info/json/ethgasAPI.json`;
const ethEndpoint = `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`;
const API_KEY = `8703745dd362001992299bdd13f73d728341894653cb592d4b070bb793c4600c`;

const Settings = ({ action }) => (
  <View style={styles.settingsContainer}>
    <TouchableHaptic impact="Light" onPress={action}>
      <Text style={human.largeTitle}>⚙️</Text>
    </TouchableHaptic>
  </View>
);

const GasPrice = ({ speed, gas, currency, toggleFormat }) => (
  <View style={styles.center}>
    <Text style={human.title1}>{speed}</Text>
    <Text style={styles.title}>
      {toggleFormat ? formatCurrency(gas, currency) : formatGwei(gas)}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center"
  },
  center: {
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

  openSettings = () => {
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
  };

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
          <Settings action={this.openSettings} />
        </Frame>
      );
    }

    const { USD } = this.state.ethData;

    const { fast, safeLow, average } = this.state.gasData;

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
                ...styles.center,
                minHeight: "100%"
              }}
            >
              <FlatList
                horizontal={true}
                data={[
                  {
                    key: "safeLow",
                    speed: "🐢",
                    gas: safeLow
                  },
                  {
                    key: "average",
                    speed: "🦆",
                    gas: average
                  },
                  {
                    key: "fast",
                    speed: "🐇",
                    gas: fast
                  }
                ]}
                renderItem={({ item }) => (
                  <GasPrice
                    speed={item.speed}
                    gas={item.gas}
                    currency={USD}
                    key={item.key}
                    toggleFormat={this.state.showGasInCurrency}
                  />
                )}
              />
            </View>
          </ScrollView>
        </View>

        <Settings action={this.openSettings} />
      </Frame>
    );
  }
}

// <TouchableHaptic
//   onPress={() => {
//     this.setState(prevState => ({
//       showGasInCurrency: !prevState.showGasInCurrency
//     }));
//   }}
// >
// </TouchableHaptic>
