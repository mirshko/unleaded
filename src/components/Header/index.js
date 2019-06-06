import React from "react";
import PropTypes from "prop-types";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Pane from "../Pane";
import TouchableHaptic from "../TouchableHaptic";

import { headerOffset } from "../../constants";

const Header = ({ action }) => (
  <Pane
    flex={0}
    justifyContent="space-between"
    flexDirection="row"
    style={{
      marginHorizontal: 12
    }}
  >
    <Pane flex={0} height={40} width={40} />
    <Pane flex={0} height={headerOffset}>
      <Image
        style={{ width: 72, height: 72 }}
        source={require("../../images/mascot.png")}
      />
    </Pane>
    <TouchableHaptic onPress={action}>
      <Pane flex={0} height={40} width={40}>
        <Ionicons name="ios-more" size={32} />
      </Pane>
    </TouchableHaptic>
  </Pane>
);

Header.propTypes = {
  action: PropTypes.func.isRequired
};

export default Header;
