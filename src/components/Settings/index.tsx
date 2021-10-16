import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as MailComposer from "expo-mail-composer";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { ActionSheetIOS, Alert, PlatformColor } from "react-native";
import { feedbackTemplate } from "../../constants";
import { useConfig } from "../../hooks";
import Pane from "../Pane";
import TouchableHaptic from "../TouchableHaptic";

const currencyOptionArray = ["USD", "GBP", "EUR", "CAD", "CNY", "RON", "JPY"];

const Settings = () => {
  const { data: config, mutate: configMutate } = useConfig();

  const sendFeedback = () => {
    MailComposer.composeAsync({
      recipients: ["unleaded@reiner.design"],
      subject: "Unleaded Feedback",
      body: feedbackTemplate,
    }).catch(() =>
      Alert.alert("Unable To Send Feedback", undefined, [
        {
          text: "Copy feedback email",
          onPress: () => Clipboard.setString("unleaded@reiner.design"),
        },
        {
          text: "OK",
        },
      ])
    );
  };

  const handleChangeCurrency = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", ...currencyOptionArray],
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex > 0) {
          const selectedCurrency = currencyOptionArray[buttonIndex - 1];

          await AsyncStorage.setItem(
            "config",
            JSON.stringify({
              ...config,
              nativeCurrency: selectedCurrency,
            })
          );

          await configMutate({
            ...config,
            nativeCurrency: selectedCurrency,
          });
        }
      }
    );
  };

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
          }`,
        ],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            WebBrowser.openBrowserAsync(`https://unleaded.reiner.design/`);
            break;
          case 2:
            sendFeedback();
            break;
          case 3:
            handleChangeCurrency();
            break;
          case 4:
            handleShowGasInCurrency();
            break;
        }
      }
    );
  };

  return (
    <TouchableHaptic onPress={() => openSettings()}>
      <Pane flex={0} height={40} width={40}>
        <Feather
          color={PlatformColor("label")}
          name="more-horizontal"
          size={32}
        />
      </Pane>
    </TouchableHaptic>
  );
};

export default Settings;
