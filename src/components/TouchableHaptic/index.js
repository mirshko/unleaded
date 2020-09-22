import * as Haptic from "expo-haptics";
import PropTypes from "prop-types";
import React from "react";
import { Pressable } from "react-native";

const TouchableHaptic = ({ children, onPress, impact }) => (
  <Pressable
    onPress={() => {
      onPress();
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle[impact]);
    }}
    style={({ pressed }) => ({
      opacity: pressed ? 0.5 : 1,
    })}
  >
    {children}
  </Pressable>
);

TouchableHaptic.defaultProps = {
  impact: "Medium",
};

TouchableHaptic.propTypes = {
  children: PropTypes.element.isRequired,
  onPress: PropTypes.func.isRequired,
  impact: PropTypes.string,
};

export default TouchableHaptic;
