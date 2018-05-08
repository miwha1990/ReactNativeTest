// Welcome to the main entry point.
//
// In this file, we'll be kicking off our app or storybook.

import { AppRegistry } from "react-native"
import { RootComponent } from "./root-component"
import { StorybookUI } from "../../storybook"

/**
 * This needs to match what's found in your app_delegate.m and MainActivity.java.
 */
const APP_NAME = "NativeTest"

AppRegistry.registerComponent(APP_NAME, () => RootComponent)
