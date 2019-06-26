import React, { useState } from "react";
import { View, Animated } from "react-native";
import { iOSColors } from "react-native-typography";

import constants from "../../constants";

const FadeInImage = props => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  _onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true
    }).start();
  };

  return (
    <Animated.Image
      onLoad={_onLoad}
      {...props}
      style={[
        {
          opacity
        },
        props.style
      ]}
    />
  );
};

const AddressIcon = ({ address }) => (
  <View
    style={{
      borderRadius: "100%",
      backgroundColor: iOSColors.customGray,
      height: 32,
      width: 32,
      marginRight: constants.spacing.large
    }}
  >
    <FadeInImage
      source={{
        uri: `https://blockies.shipchain.io/${address}.png?size=medium`,
        width: 32,
        height: 32
      }}
      style={{ width: 32, height: 32, borderRadius: 32 / 2 }}
    />
  </View>
);

export default AddressIcon;
