import React from "react";
import { PlatformColor, Text, ViewStyle } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import Pane from "../Pane";

type PillProps = {
  small?: boolean;
  style?: ViewStyle;
  children: any;
};

const Pill = ({ small, style, children }: PillProps) => (
  <Pane
    flex={0}
    style={{
      paddingLeft: small ? 8 : 10,
      paddingRight: small ? 8 : 10,
      paddingTop: small ? 2 : 4,
      paddingBottom: small ? 2 : 4,
      borderRadius: 99999,
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
