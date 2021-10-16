import React from "react";
import constants from "../../constants";
import EthereumPrice from "../EthereumPrice";
import Pane from "../Pane";
import Settings from "../Settings";

const Header = () => {
  return (
    <Pane
      flex={0}
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      style={{
        marginLeft: constants.spacing.mlarge,
        marginRight: 12,
        marginBottom: constants.spacing.large,
        marginTop: constants.spacing.large,
      }}
    >
      <EthereumPrice />

      <Settings />
    </Pane>
  );
};

export default Header;
