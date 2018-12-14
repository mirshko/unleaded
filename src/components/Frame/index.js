import React from "react";
import { SafeAreaView, StatusBar, View } from "react-native";

import Header from "../Header";

export const Wrapper = ({ children }) => (
  <View style={{ backgroundColor: "black", flex: 1 }}>
    <SafeAreaView
      style={{ backgroundColor: "white", borderRadius: 10, flex: 1 }}
    >
      <StatusBar barStyle="dark-content" />
      {children}
    </SafeAreaView>
  </View>
);

const Frame = ({ children }) => (
  <Wrapper>
    <Header />
    {children}
  </Wrapper>
);

export default Frame;
