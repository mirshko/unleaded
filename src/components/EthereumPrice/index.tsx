import React, { useState } from "react";
import { PlatformColor, Text } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import { currencies } from "../../helpers";
import { useConfig, useETHPrice } from "../../hooks";
import TouchableHaptic from "../TouchableHaptic";

const EthereumPrice = () => {
  const { data, error } = useETHPrice();

  const { data: config } = useConfig();

  const [toggle, setToggle] = useState(true);

  if (!data || error)
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
          ? `${currencies[config.nativeCurrency].symbol}${Number(
              data[config.nativeCurrency] || 0.0
            ).toFixed(2)}`
          : `1 ETH`}
      </Text>
    </TouchableHaptic>
  );
};

export default EthereumPrice;
