import React from "react";
import { Text } from "react-native";
import { iOSColors, human, sanFranciscoWeights } from "react-native-typography";

const Caps = (props) => (
  <Text
    style={{
      ...human.caption2Object,
      textTransform: "uppercase",
      color: iOSColors.gray,
      ...sanFranciscoWeights.bold,
    }}
    {...props}
  />
);

export default Caps;
