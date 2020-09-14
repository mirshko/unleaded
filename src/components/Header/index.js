import React from "react";
import { Image } from "react-native";
import { headerOffset } from "../../constants";
import Pane from "../Pane";
import Settings from "../Settings";

const Header = () => (
  <Pane
    flex={0}
    justifyContent="space-between"
    flexDirection="row"
    style={{
      marginHorizontal: 12,
    }}
  >
    <Pane flex={0} height={40} width={40} />
    <Pane flex={0} height={headerOffset}>
      <Image
        style={{ width: 72, height: 72 }}
        source={require("../../images/mascot.png")}
      />
    </Pane>
    <Settings />
  </Pane>
);

export default Header;
