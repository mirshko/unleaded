import React from "react";
import { PlatformColor, Text, TextProps } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import constants from "../../constants";

const Title = (props: TextProps) => (
  <Text
    style={{
      ...human.title3Object,
      ...sanFranciscoWeights.bold,
      marginBottom: constants.spacing.medium,
      color: PlatformColor("label"),
    }}
    {...props}
  />
);

export default Title;
