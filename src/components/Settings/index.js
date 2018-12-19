import React from "react";
import { View, Text } from "react-native";
import PropTypes from "prop-types";
import { human } from "react-native-typography";
import { isIphoneX } from "react-native-iphone-x-helper";

import TouchableHaptic from "../TouchableHaptic";

const Settings = ({ action }) => (
  <View
    style={{
      flex: 0,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: !isIphoneX() ? 16 : 0
    }}
  >
    <TouchableHaptic impact="Light" onPress={action}>
      <Text style={human.largeTitle}>⚙️</Text>
    </TouchableHaptic>
  </View>
);

Settings.propTypes = {
  action: PropTypes.func.isRequired
};

export default Settings;
