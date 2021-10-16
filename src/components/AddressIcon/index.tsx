import React from "react";
import { PlatformColor, View } from "react-native";
import { SvgUri } from "react-native-svg";
import constants from "../../constants";

const AddressIcon = ({ address }) => {
  const uri = `https://unleaded-api.vercel.app/api/blockies?address=${address}`;

  return (
    <View
      style={{
        borderRadius: 99999,
        backgroundColor: PlatformColor("systemGray6"),
        height: 32,
        width: 32,
        marginRight: constants.spacing.large,
        overflow: "hidden",
      }}
    >
      <SvgUri width="100%" height="100%" uri={uri} />
    </View>
  );
};

export default AddressIcon;
