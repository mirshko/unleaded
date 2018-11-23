import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { human } from "react-native-typography";

const Header = () => (
  <View style={styles.header}>
    <Text style={human.largeTitle}>⛽️</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center"
  }
});

export default Header;
