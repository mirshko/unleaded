import React from "react";
import { Text } from "react-native";
import { human, iOSColors, sanFranciscoWeights } from "react-native-typography";
import Pane from "../Pane";

const Pill = ({ small, style, children }) => (
  <Pane
    backgroundColor={iOSColors.customGray}
    flex={0}
    style={{
      paddingLeft: small ? 8 : 10,
      paddingRight: small ? 8 : 10,
      paddingTop: small ? 2 : 4,
      paddingBottom: small ? 2 : 4,
      borderRadius: "100%",
      ...style,
    }}
  >
    <Text
      style={
        small
          ? {
              ...human.calloutObject,
              ...sanFranciscoWeights.medium,
            }
          : {
              ...human.bodyObject,
              ...sanFranciscoWeights.semibold,
            }
      }
    >
      {children}
    </Text>
  </Pane>
);

export default Pill;
