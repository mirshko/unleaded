import { KeepAwake, registerRootComponent } from "expo";
import App from "./src/App";

if (__DEV__) {
  KeepAwake.activate();
}

registerRootComponent(App);
