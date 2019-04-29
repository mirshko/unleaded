import React from "react";
import { View } from "react-native";

const Gutter = props => (
  <View {...props} style={{ marginLeft: 20, marginRight: 20 }} />
);

export default Gutter;
