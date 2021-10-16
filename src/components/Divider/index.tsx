import React from "react";
import { PlatformColor, View, ViewStyle } from "react-native";

type DividerProps = {
  style?: ViewStyle;
  mr?: number;
  ml?: number;
  mb?: number;
  mt?: number;
};

const Divider = ({ style, mr, ml, mb, mt }: DividerProps) => (
  <View
    style={{
      height: 1,
      backgroundColor: PlatformColor("separator"),
      marginBottom: mb,
      marginTop: mt,
      marginRight: mr,
      marginLeft: ml,
      ...style,
    }}
  />
);

export default Divider;
