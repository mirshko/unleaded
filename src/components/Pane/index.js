import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";

const Pane = ({
  children,
  flex,
  flexDirection,
  alignItems,
  justifyContent,
  backgroundColor,
  height,
  width,
  style
}) => (
  <View
    style={{
      flex,
      flexDirection,
      height,
      width,
      alignItems,
      justifyContent,
      backgroundColor,
      ...style
    }}
  >
    {children}
  </View>
);

Pane.defaultProps = {
  flex: 1,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
};

Pane.propTypes = {
  style: PropTypes.object,
  flex: PropTypes.number,
  height: PropTypes.number,
  width: PropTypes.number,
  flexDirection: PropTypes.string,
  alignItems: PropTypes.string,
  justifyContent: PropTypes.string,
  backgroundColor: PropTypes.string
};

export default Pane;
