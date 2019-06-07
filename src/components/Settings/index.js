import React from "react";
import { ActionSheetIOS, Alert, Clipboard } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as MailComposer from "expo-mail-composer";
import * as WebBrowser from "expo-web-browser";

import TouchableHaptic from "../TouchableHaptic";
import Pane from "../Pane";

import { Config, DataContainer } from "../../containers";

import { feedbackTemplate } from "../../constants";

const Settings = () => {
  const config = Config.useContainer();
  const data = DataContainer.useContainer();

  const sendFeedback = () => {
    MailComposer.composeAsync({
      recipients: ["unleaded@reiner.design"],
      subject: "Unleaded Feedback",
      body: feedbackTemplate
    }).catch(() =>
      Alert.alert("Unable To Send Feedback", undefined, [
        {
          text: "Copy feedback email",
          onPress: () => Clipboard.setString("unleaded@reiner.design")
        },
        {
          text: "OK"
        }
      ])
    );
  };

  const openSettings = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          "Cancel",
          "About",
          "Leave feedback",
          "Change your currency",
          `${
            config.showGasInCurrency
              ? "Show gas in Gwei"
              : "Show gas in currency"
          }`
        ],
        cancelButtonIndex: 0
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 1:
            WebBrowser.openBrowserAsync(`https://unleaded.reiner.design/`);
            break;
          case 2:
            sendFeedback();
            break;
          case 3:
            data.handleChangeCurrency();
            break;
          case 4:
            config.handleShowGasInCurrency();
            break;
        }
      }
    );
  };

  return (
    <TouchableHaptic onPress={() => openSettings()}>
      <Pane flex={0} height={40} width={40}>
        <Ionicons name="ios-more" size={32} />
      </Pane>
    </TouchableHaptic>
  );
};

export default Settings;
