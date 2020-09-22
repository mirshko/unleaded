import React, { useState } from "react";
import { PlatformColor, Text } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import constants from "../../constants";
import { AppContainer } from "../../containers";
import { currencies } from "../../helpers";
import TouchableHaptic from "../TouchableHaptic";

const EthereumPrice = () => {
  const {
    nativeCurrency,
    ethData,
    isLoading,
    hasErrored,
  } = AppContainer.useContainer();

  const [toggle, setToggle] = useState(true);

  if (isLoading || hasErrored)
    return (
      <Text
        style={{
          ...human.largeTitleObject,
          ...sanFranciscoWeights.black,
          color: PlatformColor("label"),
          height: 40,
        }}
      >
        Unleaded
      </Text>
    );

  return (
    <TouchableHaptic onPress={() => setToggle(!toggle)}>
      <Text
        style={{
          ...human.largeTitleObject,
          ...sanFranciscoWeights.black,
          color: PlatformColor("label"),
          height: 40,
        }}
      >
        {toggle
          ? `${currencies[nativeCurrency].symbol}${Number(
              ethData[nativeCurrency] || 0.0
            ).toFixed(2)}`
          : `1 ETH`}
      </Text>
    </TouchableHaptic>
  );
};

export default EthereumPrice;
