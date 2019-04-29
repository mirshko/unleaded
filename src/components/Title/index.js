import React from "react";
import { Text } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";

const Title = props => (
  <Text
    style={{
      ...human.title3Object,
      ...sanFranciscoWeights.bold,
      marginBottom: 8
    }}
    {...props}
  />
);

export default Title;
