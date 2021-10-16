import * as Haptic from "expo-haptics";
import React from "react";
import { Pressable } from "react-native";

type TouchableHapticProps = {
  children: any;
  onPress: () => void;
  impact?: Haptic.ImpactFeedbackStyle;
};

const TouchableHaptic = ({
  children,
  onPress,
  impact = Haptic.ImpactFeedbackStyle.Medium,
}: TouchableHapticProps) => (
  <Pressable
    onPress={() => {
      onPress();
      Haptic.impactAsync(impact);
    }}
    style={({ pressed }) => ({
      opacity: pressed ? 0.5 : 1,
    })}
  >
    {children}
  </Pressable>
);

export default TouchableHaptic;
