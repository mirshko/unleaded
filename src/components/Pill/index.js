import React from "react";
import { Text } from "react-native";
import { iOSColors } from "react-native-typography";

import Pane from "../Pane";

const Pill = ({ children }) => (
  <Pane
    backgroundColor={iOSColors.customGray}
    flex={0}
    style={{
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 4,
      paddingBottom: 4,
      marginRight: 8,
      borderRadius: "100%"
    }}
  >
    <Text
      style={{
        ...human.bodyObject,
        ...sanFranciscoWeights.semibold
      }}
    >
      {children}
    </Text>
  </Pane>
);

export default Pill;
