import React from "react";
import { View, ViewProps } from "react-native";
import constants from "../../constants";

const Gutter = (props: ViewProps) => (
  <View
    {...props}
    style={{
      marginLeft: constants.spacing.mlarge,
      marginRight: constants.spacing.mlarge,
    }}
  />
);

export default Gutter;
