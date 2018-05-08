import * as React from "react"
import { View, TouchableOpacity, Text, StyleSheet } from "react-native"

type CellProps = {
  cellWidth?: number
  children?: React.ChildrenArray<React.Element>
  style?: Style
  textStyle?: Style
  text?: string | number
  touchable?: boolean
  onPress?: () => void,
}

class Cell extends React.PureComponent<CellProps> {
  static defaultProps = {
    cellWidth: 34,
  }

  createCell = style => (
    <View style={style}>
      {this.props.children || (
        <Text style={[tableStyles.text, this.props.textStyle]}>{this.props.text}</Text>
      )}
    </View>
  )

  render() {
    const containerStyle = [tableStyles.cell, { width: this.props.cellWidth }, this.props.style]

    return this.props.touchable ? (
      <TouchableOpacity onPress={this.props.onPress} style={containerStyle}>
        {this.createCell()}
      </TouchableOpacity>
    ) : (
      this.createCell(containerStyle)
    )
  }
}

class HeaderCell extends React.PureComponent<CellProps> {
  render() {
    return <Cell {...this.props} textStyle={[tableStyles.header, this.props.textStyle]} />
  }
}

type RowProps = {
  bgColor?: string
  idx?: number
  children: React.ChildrenArray<React.Element>
  touchable?: boolean
  onPress?: () => void,
}

class Row extends React.PureComponent<RowProps> {
  static defaultProps = {
    bgColor: "#f6f6f6",
    idx: null,
  }
  render() {
    const backgroundColor =
      this.props.idx !== null && this.props.idx % 2 !== 0 ? "white" : this.props.bgColor
    const row = <View style={[tableStyles.row, { backgroundColor }]}>{this.props.children}</View>

    return this.props.touchable ? (
      <TouchableOpacity onPress={this.props.onPress}>{row}</TouchableOpacity>
    ) : (
      row
    )
  }
}

type Props = {
  children: React.ChildrenArray<React.Element>,
}

class Table extends React.Component<Props> {
  static Cell = Cell
  static HeaderCell = HeaderCell
  static Row = Row

  render() {
    return this.props.children
  }
}

export const tableStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  cell: {
    paddingVertical: 12,
    justifyContent: "center",
    flexShrink: 0,
  },
  header: {
    fontWeight: "900",
    fontSize: 9,
    textAlign: "center",
  },
  text: {
    fontSize: 12,
    textAlign: "center",
    color: "black",
  },
  textBonusPoints: {
    fontSize: 12,
    textAlign: "center",
    color: "#aaa",
  },
  points: {
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
    color: "black",
  },
})

export default Table
