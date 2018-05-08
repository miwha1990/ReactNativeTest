import * as React from "react"

import { StyleSheet } from "react-native"

import Table from "../shared/table"

export default function ListHeader() {
  return (
    <Table.Row bgColor={"black"} style={{ width: "100%" }}>
      <Table.Cell textStyle={styles.headerText} cellWidth={"30%"} text={"AVATAR"} />
      <Table.Cell textStyle={styles.headerText} cellWidth={"50%"} text={"LOGIN"} />
      <Table.Cell textStyle={styles.headerText} cellWidth={"20%"} text={"WEB LINK"} />
    </Table.Row>
  )
}

const styles = StyleSheet.create({
  headerText: {
    color: "white",
    textAlign: "left",
    fontWeight: "900",
    fontSize: 17,
    textAlign: "center",
  },
})
