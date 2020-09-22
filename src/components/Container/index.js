import React from "react";
import { SafeAreaView, PlatformColor } from "react-native";
import { StatusBar } from "expo-status-bar";

export const Container = ({ children }) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: PlatformColor("systemBackground"),
        flex: 1,
      }}
    >
      <StatusBar style="auto" />
      {children}
    </SafeAreaView>
  );
};

export default Container;
