import React from "react";
import { Text } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import constants from "../../constants";

const Title = (props) => (
  <Text
    style={{
      ...human.title3Object,
      ...sanFranciscoWeights.bold,
      marginBottom: constants.spacing.medium,
    }}
    {...props}
  />
);

export default Title;
