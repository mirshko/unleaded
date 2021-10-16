import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { PlatformColor, Text } from "react-native";
import { human } from "react-native-typography";
import constants from "../../constants";
import { currencies, formatCurrency, formatTime } from "../../helpers";
import { useConfig } from "../../hooks";
import Pane from "../Pane";
import Pill from "../Pill";
import TouchableHaptic from "../TouchableHaptic";

const GasSpeed = ({ speed, wait, gas, ethData, ...rest }) => {
  const { data: config, mutate: configMutate } = useConfig();

  const handleShowGasInCurrency = async () => {
    const { showGasInCurrency } = config;

    await AsyncStorage.setItem(
      "config",
      JSON.stringify({
        ...config,
        showGasInCurrency: !showGasInCurrency,
      })
    );

    await configMutate({
      ...config,
      showGasInCurrency: !showGasInCurrency,
    });
  };

  const symbol = currencies[config.nativeCurrency].symbol;

  const gasInCurrency = formatCurrency(
    gas,
    ethData[config.nativeCurrency] || 0
  );

  return (
    <Pane flex={1} flexDirection="row" justifyContent="space-between" {...rest}>
      <Pane flex={0} alignItems="flex-start" height={32}>
        <Text
          style={{
            ...human.title2Object,
            color: PlatformColor("label"),
          }}
        >
          {speed}
        </Text>
      </Pane>

      <Pane flex={0}>
        <TouchableHaptic onPress={handleShowGasInCurrency}>
          <Pane flex={0} flexDirection="row">
            <Pill style={{ marginRight: constants.spacing.medium }}>
              {formatTime(wait)}
            </Pill>

            <Pill>
              {config.showGasInCurrency
                ? `${symbol}${gasInCurrency}`
                : `${gas} Gwei`}
            </Pill>
          </Pane>
        </TouchableHaptic>
      </Pane>
    </Pane>
  );
};

export default GasSpeed;
