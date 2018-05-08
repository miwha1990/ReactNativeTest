import { TouchableOpacityProperties } from "react-native"

export interface UserRowProps extends TouchableOpacityProperties {
  /**
   * Text which is looked up via i18n.
   */
  idx?: number

  /**
   * The text to display if not using `tx` or nested components.
   */
  user?: object
}
