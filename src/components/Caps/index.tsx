import React from "react";
import { PlatformColor, Text, TextProps } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";

const Caps = (props: TextProps) => (
  <Text
    style={{
      ...human.caption2Object,
      textTransform: "uppercase",
      color: PlatformColor("secondaryLabel"),
      ...sanFranciscoWeights.bold,
    }}
    {...props}
  />
);

export default Caps;
