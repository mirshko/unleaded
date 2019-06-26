import React from "react";
import { Text } from "react-native";
import { human } from "react-native-typography";

import Pane from "../Pane";
import TouchableHaptic from "../TouchableHaptic";
import Pill from "../Pill";

import { AppContainer } from "../../containers";

import constants from "../../constants";

import { formatCurrency, formatTime, currencies } from "../../helpers";

const GasSpeed = ({ speed, wait, gas, ...rest }) => {
  const {
    nativeCurrency,
    ethData,
    showGasInCurrency,
    toggleShowGasInCurrency
  } = AppContainer.useContainer();

  const symbol = currencies[nativeCurrency].symbol;
  const gasInCurrency = formatCurrency(gas, ethData[nativeCurrency]);

  return (
    <Pane flex={1} flexDirection="row" justifyContent="space-between" {...rest}>
      <Pane flex={0} alignItems="flex-start" height={32}>
        <Text style={human.title2}>{speed}</Text>
      </Pane>

      <Pane flex={0}>
        <TouchableHaptic
          onPress={() => toggleShowGasInCurrency(!showGasInCurrency)}
        >
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
