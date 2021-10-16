import React from "react";
import { View, ViewStyle } from "react-native";

type PaneProps = ViewStyle & { children: any; style?: ViewStyle };

const Pane = ({
  children,
  flex = 1,
  flexDirection = "column",
  alignItems = "center",
  justifyContent = "center",
  backgroundColor,
  height,
  width,
  style,
}: PaneProps) => (
  <View
    style={{
      flex,
      flexDirection,
      height,
      width,
      alignItems,
      justifyContent,
      backgroundColor,
      ...style,
    }}
  >
    {children}
  </View>
);

export default Pane;
