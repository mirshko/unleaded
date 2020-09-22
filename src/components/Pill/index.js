import React from "react";
import { PlatformColor, Text } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import Pane from "../Pane";

const Pill = ({ small, style, children }) => (
  <Pane
    flex={0}
    style={{
      paddingLeft: small ? 8 : 10,
      paddingRight: small ? 8 : 10,
      paddingTop: small ? 2 : 4,
      paddingBottom: small ? 2 : 4,
      borderRadius: "100%",
      backgroundColor: PlatformColor("systemGray6"),
      ...style,
    }}
  >
    <Text
      style={
        small
          ? {
              ...human.calloutObject,
              ...sanFranciscoWeights.medium,
              color: PlatformColor("label"),
            }
          : {
              ...human.bodyObject,
              ...sanFranciscoWeights.semibold,
              color: PlatformColor("label"),
            }
      }
    >
      {children}
    </Text>
  </Pane>
);

export default Pill;
