import { useConfig, useETHPrice, useFeeEstimate } from "../../hooks";
import React from "react";
import Title from "../Title";
import constants, { MINIMUM_GAS_LIMIT } from "../../constants";
import Divider from "../Divider";
import { PlatformColor, Text, View } from "react-native";
import { human, sanFranciscoWeights } from "react-native-typography";
import Pane from "../Pane";
import Pill from "../Pill";
import { toCurrency } from "../../helpers";
import Gutter from "../Gutter";
import Caps from "../Caps";

function Fee({
  threshold,
  exchangeRate,
  nativeCurrency,
  priorityFee,
  speed,
  tip,
  ...rest
}) {
  const tipInCurrency = (exchangeRate * priorityFee * MINIMUM_GAS_LIMIT) / 1e9;

  return (
    <Pane flex={1} flexDirection="row" justifyContent="space-between" {...rest}>
      <Pane flex={0} flexDirection="row" alignItems="center" height={32}>
        <Text
          style={{
            ...human.title2Object,
            color: PlatformColor("label"),
            marginRight: constants.spacing.medium,
          }}
        >
          {speed}
        </Text>

        {/* <Pill small>{`~${threshold}m`}</Pill> */}
      </Pane>

      <Pane flex={0} flexDirection="row">
        <Pill style={{ marginRight: constants.spacing.medium }}>
          {`${priorityFee} Gwei`}
        </Pill>

        <Pill>{`${toCurrency(tipInCurrency, nativeCurrency)}`}</Pill>
      </Pane>
    </Pane>
  );
}

export default function FeeEstimate() {
  const { data: feeEstimate } = useFeeEstimate();
  const { data: ethPrice } = useETHPrice();
  const { data: config } = useConfig();

  const exchangeRate = ethPrice.result[config.nativeCurrency];

  const feeInCurrency =
    (exchangeRate * feeEstimate.result.baseFee * MINIMUM_GAS_LIMIT) / 1e9;

  return (
    <Gutter>
      <View style={{ marginVertical: constants.spacing.xlarge }}>
        <Pane flex={1} flexDirection="row" justifyContent="space-between">
          <Text
            style={{
              ...human.title2Object,
              ...sanFranciscoWeights.bold,
              color: PlatformColor("label"),
            }}
          >
            Base Fee
          </Text>

          <Pane flex={0} flexDirection="row">
            <Pill style={{ marginRight: constants.spacing.medium }}>
              {`${feeEstimate.result.baseFee} Gwei`}
            </Pill>

            <Pill>{`${toCurrency(feeInCurrency, config.nativeCurrency)}`}</Pill>
          </Pane>
        </Pane>
      </View>

      <Divider mb={constants.spacing.xlarge} />

      <View style={{ marginBottom: constants.spacing.xlarge }}>
        <Title>Priority Fees</Title>
        <Caps>By Miner Tip (EIP-1559)</Caps>
      </View>

      <Fee
        speed="Fast"
        threshold={2}
        tip={feeEstimate.result.gasPrice.instant}
        priorityFee={feeEstimate.result.priorityFee.instant}
        nativeCurrency={config.nativeCurrency}
        exchangeRate={exchangeRate}
        style={{ marginBottom: constants.spacing.large }}
      />

      <Divider mb={constants.spacing.large} />

      <Fee
        speed="Standard"
        threshold={5}
        tip={feeEstimate.result.gasPrice.fast}
        priorityFee={feeEstimate.result.priorityFee.fast}
        nativeCurrency={config.nativeCurrency}
        exchangeRate={exchangeRate}
        style={{ marginBottom: constants.spacing.large }}
      />

      <Divider mb={constants.spacing.large} />

      <Fee
        speed="Safe Low"
        threshold={30}
        tip={feeEstimate.result.gasPrice.standard}
        priorityFee={feeEstimate.result.priorityFee.standard}
        nativeCurrency={config.nativeCurrency}
        exchangeRate={exchangeRate}
      />
    </Gutter>
  );
}
