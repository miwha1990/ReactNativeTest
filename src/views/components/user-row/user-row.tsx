import * as React from "react"

import { Image, Linking, TouchableOpacity, Text, StyleSheet } from "react-native"

import Table from "../../shared/table"
import { UserRowProps } from "./user-row.props"

/**
 * Stateless functional component for your needs
 *
 * Component description here for TypeScript tips.
 */
export function UserRow(props: UserRowProps) {
  const { idx, user, onPress } = props
  return (
    <Table.Row idx={idx} onPress={() => onPress(user)} touchable>
      <Table.Cell cellWidth={"30%"}>
        <Image style={{ width: 100, height: 100 }} source={{ uri: user.avatar_url }} />
      </Table.Cell>
      <Table.Cell textStyle={styles.textStyle} cellWidth={"50%"} text={user.login} />
      <Table.Cell cellWidth={"20%"}>
        <TouchableOpacity onPress={() => Linking.openURL(user.html_url)}>
          <Text style={styles.linkStyle}>Link</Text>
        </TouchableOpacity>
      </Table.Cell>
    </Table.Row>
  )
}

const styles = StyleSheet.create({
  textStyle: {
    textAlign: "center",
    fontSize: 15,
    color: "black",
  },
  linkStyle: {
    textAlign: "center",
    fontSize: 15,
    color: "#0062e5",
    padding: 10,
  },
})
