import Constants from "expo-constants";

const constants = {
  headerOffset: 80,
  buildNumber: Constants.manifest.ios.buildNumber,
  version: Constants.manifest.version,
  systemVersion: Constants.platform.ios.systemVersion,
  model: Constants.platform.ios.model
};

const feedbackTemplate = `

---
Build: ${constants.buildNumber}
App Version: ${constants.version}
iOS Version: ${constants.systemVersion}
Device: ${constants.model}
`;

export default constants;
export { feedbackTemplate };
