import React from "react";
import { View, Image } from "react-native";
import { iOSColors } from "react-native-typography";

const AddressIcon = ({ address }) => (
  <View
    style={{
      borderRadius: "100%",
      backgroundColor: iOSColors.customGray,
      height: 32,
      width: 32,
      marginRight: 16
    }}
  >
    <Image
      source={{
        uri: `https://identicon.org?t=${address}&s=32`,
        cache: "only-if-cached",
        width: 32,
        height: 32
      }}
      style={{ width: 32, height: 32 }}
    />
  </View>
);

export default AddressIcon;
