import React from "react";
import { SafeAreaView, StatusBar } from "react-native";

import Header from "../Header";

export const Wrapper = ({ children }) => (
  <SafeAreaView style={{ flex: 1 }}>
    <StatusBar barStyle="dark-content" />
    {children}
  </SafeAreaView>
);

const Frame = ({ children }) => (
  <Wrapper>
    <Header />
    {children}
  </Wrapper>
);

export default Frame;
