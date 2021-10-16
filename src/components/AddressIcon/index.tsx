import React, { useState } from "react";
import { Animated, Image, ImageProps, PlatformColor, View } from "react-native";
import constants from "../../constants";

const FadeInImage = ({ source, style, ...rest }: ImageProps) => {
  const [opacity, setOpacity] = useState(new Animated.Value(0));

  const _onLoad = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.Image
      source={source}
      onLoad={_onLoad}
      {...rest}
      style={[
        {
          opacity,
        },
        style,
      ]}
    />
  );
};

const AddressIcon = ({ address }) => (
  <View
    style={{
      borderRadius: 99999,
      backgroundColor: PlatformColor("systemGray6"),
      height: 32,
      width: 32,
      marginRight: constants.spacing.large,
    }}
  >
    <FadeInImage
      source={{
        uri: `https://blockies.shipchain.io/${address}.png?size=medium`,
        width: 32,
        height: 32,
      }}
      style={{ width: 32, height: 32, borderRadius: 32 / 2 }}
    />
  </View>
);

export default AddressIcon;
