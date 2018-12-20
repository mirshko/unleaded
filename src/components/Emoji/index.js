import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import { human } from "react-native-typography";

const Emoji = ({ children }) => (
  <Text style={human.largeTitle}>{children}</Text>
);

Emoji.propTypes = {
  children: PropTypes.string.isRequired
};

export default Emoji;
