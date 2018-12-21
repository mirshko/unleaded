import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";

const Header = () => (
  <View style={styles.header}>
    <Text>⛽️</Text>
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
