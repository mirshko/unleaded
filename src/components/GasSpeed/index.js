import React from "react";
import { PlatformColor, Text } from "react-native";
import { human } from "react-native-typography";
import constants from "../../constants";
import { currencies, formatCurrency, formatTime } from "../../helpers";
import { useConfig } from "../../hooks";
import Pane from "../Pane";
import Pill from "../Pill";

const GasSpeed = ({ speed, wait, gas, ethData, ...rest }) => {
  const { data: config } = useConfig();

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
      </Pane>
    </Pane>
  );
};

export default GasSpeed;
