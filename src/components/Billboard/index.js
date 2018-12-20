import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";
import { human, sanFranciscoWeights } from "react-native-typography";

const Billboard = ({ children, small }) => (
  <Text
    style={{
      ...human.largeTitleObject,
      ...sanFranciscoWeights.black,
      fontSize: !small ? 40 : human.title1Object.fontSize,
      lineHeight: !small ? 48 : human.title1Object.lineHeight,
      letterSpacing: !small
        ? human.largeTitleObject.letterSpacing
        : human.title1Object.letterSpacing
    }}
  >
    {children}
  </Text>
);

Billboard.propTypes = {
  children: PropTypes.string.isRequired,
  small: PropTypes.bool
};

export default Billboard;
