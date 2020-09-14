import React, { useState } from "react";
import { Text } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";

import TouchableHaptic from "../TouchableHaptic";

import { AppContainer } from "../../containers";

import constants from "../../constants";

import { currencies } from "../../helpers";

const EthereumPrice = () => {
  const { nativeCurrency, ethData } = AppContainer.useContainer();

  const [toggle, setToggle] = useState(true);

  return (
    <TouchableHaptic onPress={() => setToggle(!toggle)}>
      <Text
        style={{
          ...human.largeTitleObject,
          ...sanFranciscoWeights.black,
          marginTop: constants.spacing.xlarge,
        }}
      >
        {toggle
          ? `${currencies[nativeCurrency].symbol}${Number(
              ethData[nativeCurrency]
            ).toFixed(2)}`
          : `1 ETH`}
      </Text>
    </TouchableHaptic>
  );
};

export default EthereumPrice;
