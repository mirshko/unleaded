import { Constants } from "expo";

const constants = {
  headerOffset: 80,
  buildNumber: Constants.manifest.ios.buildNumber,
  version: Constants.manifest.version,
  systemVersion: Constants.platform.ios.systemVersion,
  model: Constants.platform.ios.model
};

export default constants;
