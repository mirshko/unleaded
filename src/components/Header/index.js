import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";

import Emoji from "../Emoji";

const Header = () => (
  <View style={styles.header}>
    <Emoji>⛽️</Emoji>
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: !isIphoneX() ? 16 : 0
  }
});

export default Header;
