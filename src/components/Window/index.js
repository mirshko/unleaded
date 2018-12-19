import React from "react";
import { ScrollView, RefreshControl } from "react-native";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";

import theme from "../../styles/theme";

const Window = ({ children, refreshFunc, refreshingState }) => (
  <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    refreshControl={
      <RefreshControl refreshing={refreshingState} onRefresh={refreshFunc} />
    }
  >
    <Swiper
      height={0}
      index={1}
      activeDotColor={theme.pump}
      loop={false}
      bounces={true}
    >
      {children}
    </Swiper>
  </ScrollView>
);

Window.propTypes = {
  children: PropTypes.array.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  refreshingState: PropTypes.bool.isRequired
};

export default Window;
