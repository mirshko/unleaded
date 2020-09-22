import React from "react";
import { View, PlatformColor } from "react-native";

const Divider = ({ style, mr, ml, mb, mt }) => (
  <View
    style={{
      height: 1,
      backgroundColor: PlatformColor("separator"),
      marginBottom: mb,
      marginTop: mt,
      marginRight: mr,
      marginLeft: ml,
      ...style,
    }}
  />
);

export default Divider;
