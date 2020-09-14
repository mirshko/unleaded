import PropTypes from "prop-types";
import React from "react";
import { RefreshControl, ScrollView } from "react-native";

const RefreshSwiper = ({ children, refreshFunc, refreshingState }) => (
  <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    refreshControl={
      <RefreshControl refreshing={refreshingState} onRefresh={refreshFunc} />
    }
  >
    {children}
  </ScrollView>
);

RefreshSwiper.propTypes = {
  children: PropTypes.array.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  refreshingState: PropTypes.bool.isRequired,
};

export default RefreshSwiper;
