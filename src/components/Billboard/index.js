import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import { human, sanFranciscoWeights } from "react-native-typography";

const Billboard = ({ children }) => (
  <Text
    style={{
      ...human.largeTitleObject,
      ...sanFranciscoWeights.black,
      fontSize: 40,
      lineHeight: 48
    }}
  >
    {children}
  </Text>
);

Billboard.propTypes = {
  children: PropTypes.string.isRequired
};

export default Billboard;
