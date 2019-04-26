import React from "react";
import { View } from "react-native";
import { iOSColors } from "react-native-typography";

const Divider = ({ style, marginBottom, marginTop }) => (
  <View
    style={{
      height: 1,
      backgroundColor: iOSColors.lightGray,
      marginBottom,
      marginTop,
      ...style
    }}
  />
);

export default Divider;
