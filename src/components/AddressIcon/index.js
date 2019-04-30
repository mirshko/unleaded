import React from "react";
import { View, Animated } from "react-native";
import { iOSColors } from "react-native-typography";

class FadeInImage extends React.Component {
  state = {
    opacity: new Animated.Value(0)
  };

  _onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true
    }).start();
  };

  render() {
    return (
      <Animated.Image
        onLoad={this._onLoad}
        {...this.props}
        style={[
          {
            opacity: this.state.opacity
          },
          this.props.style
        ]}
      />
    );
  }
}

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
