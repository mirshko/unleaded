import React from "react";
import { View } from "react-native";

import constants from "../../constants";

const Gutter = props => (
  <View
    {...props}
    style={{
      marginLeft: constants.spacing.mlarge,
      marginRight: constants.spacing.mlarge
    }}
  />
);

export default Gutter;
