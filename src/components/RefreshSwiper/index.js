import React from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";

import constants from "../../styles/constants";

const styles = StyleSheet.create({
  dot: {
    height: 7,
    width: 7,
    marginRight: 9 / 2,
    marginLeft: 9 / 2,
    borderRadius: 7 / 2
  }
});

const RefreshSwiper = ({ children, refreshFunc, refreshingState }) => (
  <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    refreshControl={
      <RefreshControl refreshing={refreshingState} onRefresh={refreshFunc} />
    }
  >
    <Swiper
      height={0}
      index={1}
      loop={false}
      bounces={true}
      paginationStyle={{
        backgroundColor: "transparent",
        bottom: 0,
        height: constants.headerOffset
      }}
      dotColor="rgba(0, 0, 0, 0.3)"
      dotStyle={styles.dot}
      activeDotColor="black"
      activeDotStyle={styles.dot}
    >
      {children}
    </Swiper>
  </ScrollView>
);

RefreshSwiper.propTypes = {
  children: PropTypes.array.isRequired,
  refreshFunc: PropTypes.func.isRequired,
  refreshingState: PropTypes.bool.isRequired
};

export default RefreshSwiper;
