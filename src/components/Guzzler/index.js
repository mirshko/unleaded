import * as WebBrowser from "expo-web-browser";
import React from "react";
import { ActionSheetIOS, Text, View } from "react-native";
import { human } from "react-native-typography";
import constants from "../../constants";
import { truncateAddress } from "../../helpers";
import AddressIcon from "../AddressIcon";
import Pane from "../Pane";
import Pill from "../Pill";
import TouchableHaptic from "../TouchableHaptic";

const Guzzler = ({ address, pct, ...rest }) => {
  const viewAddress = (address) => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "View on Alethio", "View on Etherscan"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            WebBrowser.openBrowserAsync(`https://aleth.io/account/${address}`);
            break;
          case 2:
            WebBrowser.openBrowserAsync(
              `https://etherscan.io/address/${address}`
            );
            break;
        }
      }
    );
  };

  return (
    <View style={{ marginBottom: constants.spacing.large }} {...rest}>
      <TouchableHaptic onPress={() => viewAddress(address)}>
        <Pane flexDirection="row" justifyContent="space-between" height={32}>
          <Pane flexDirection="row" flex={0}>
            <AddressIcon address={address} />
            <Text style={human.body}>{truncateAddress(address)}</Text>
          </Pane>

          <Pill small>{pct.toFixed(2)}%</Pill>
        </Pane>
      </TouchableHaptic>
    </View>
  );
};

export default Guzzler;
