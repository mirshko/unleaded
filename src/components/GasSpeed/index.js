import React from "react";
import { PlatformColor, Text } from "react-native";
import { human } from "react-native-typography";
import constants from "../../constants";
import { AppContainer } from "../../containers";
import { currencies, formatCurrency, formatTime } from "../../helpers";
import Pane from "../Pane";
import Pill from "../Pill";
import TouchableHaptic from "../TouchableHaptic";

const GasSpeed = ({ speed, wait, gas, ...rest }) => {
  const {
    nativeCurrency,
    ethData,
    showGasInCurrency,
    handleShowGasInCurrency,
  } = AppContainer.useContainer();

  const symbol = currencies[nativeCurrency].symbol;
  const gasInCurrency = formatCurrency(gas, ethData[nativeCurrency] || 0);

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
              {showGasInCurrency ? `${symbol}${gasInCurrency}` : `${gas} Gwei`}
            </Pill>
          </Pane>
        </TouchableHaptic>
      </Pane>
    </Pane>
  );
};

export default GasSpeed;
