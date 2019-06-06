import React from "react";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import * as Haptic from "expo-haptics";

const TouchableHaptic = ({ children, onPress, impact }) => (
  <TouchableOpacity
    onPressOut={() => Haptic.impactAsync(Haptic.ImpactFeedbackStyle[impact])}
    onPress={onPress}
  >
    {children}
  </TouchableOpacity>
);

TouchableHaptic.defaultProps = {
  impact: "Medium"
};

TouchableHaptic.propTypes = {
  children: PropTypes.element.isRequired,
  onPress: PropTypes.func.isRequired,
  impact: PropTypes.string
};

export default TouchableHaptic;
