import * as Clipboard from "expo-clipboard";
import React from "react";
import {
  ActionSheetIOS,
  PlatformColor,
  Text,
  View,
  ViewProps,
} from "react-native";
import { human } from "react-native-typography";
import constants from "../../constants";
import { truncateAddress } from "../../helpers";
import AddressIcon from "../AddressIcon";
import Pane from "../Pane";
import Pill from "../Pill";
import TouchableHaptic from "../TouchableHaptic";

type GuzzlerProps = ViewProps & { address: string; id: string; pct: number };

const Guzzler = ({ address, id, pct, ...rest }: GuzzlerProps) => {
  const handleActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Copy Address"],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            Clipboard.setString(address);
            break;
        }
      }
    );
  };

  return (
    <View style={{ marginBottom: constants.spacing.large }} {...rest}>
      <TouchableHaptic onPress={handleActionSheet}>
        <Pane flexDirection="row" justifyContent="space-between" height={32}>
          <Pane flexDirection="row" flex={0}>
            <AddressIcon address={address} />
            <Text
              style={{
                ...human.bodyObject,
                color: PlatformColor("label"),
              }}
            >
              {id || truncateAddress(address)}
            </Text>
          </Pane>

          <Pill small>{pct.toFixed(2)}%</Pill>
        </Pane>
      </TouchableHaptic>
    </View>
  );
};

export default Guzzler;
