import React from "react";
import { View } from "react-native";
import { iOSColors } from "react-native-typography";

const Divider = ({ style, mr, ml, mb, mt }) => (
  <View
    style={{
      height: 1,
      backgroundColor: iOSColors.lightGray,
      marginBottom: mb,
      marginTop: mt,
      marginRight: mr,
      marginLeft: ml,
      ...style
    }}
  />
);

export default Divider;
