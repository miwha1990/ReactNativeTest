import * as React from "react"
import { action, observable } from "mobx"
import { FlatList, View, StyleSheet, ActivityIndicator } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { observer, inject } from "mobx-react"

import { Text } from "../../shared/text"
import { Screen } from "../../shared/screen"
import { UserRow } from "../../components/user-row"
import ListHeader from "../../components/ListHeader"
import { Header } from "../../shared/header"

export interface GithubUsersList extends NavigationScreenProps<{}> {}

@inject("usersStore")
@observer
export class GithubUsersList extends React.Component<GithubUsersList, {}> {
  _keyExtractor = (item, index) => index.toString()

  @observable page = 1

  @action.bound
  nextPage() {
    this.page++
  }

  componentDidMount() {
    this.getUsers()
  }

  @action.bound
  getUsers() {
    const {
      usersStore: { fetchUsers },
    } = this.props
    fetchUsers()
  }

  handleRowPress(user) {
    this.props.navigation.navigate("GithubUserFollowersNavigator", { user })
  }

  fetchNextPage() {
    const {
      usersStore: { addUsers },
    } = this.props
    this.nextPage()
    addUsers(this.page)
  }

  renderFooter = () => {
    const {
      usersStore: { adding },
    } = this.props
    if (!adding) return null

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  render() {
    const {
      usersStore: { users, isLoading },
    } = this.props

    return isLoading ? (
      <ActivityIndicator animating size="large" color="#0000ff" style={{ flex: 1 }} />
    ) : (
      <Screen preset="fixedCenter">
        <Header
          headerText="GitHub's users"
          titleStyle={{ fontSize: 17, fontWeight: "900" }}
          style={{ backgroundColor: "#d0d0d0", paddingTop: 26 }}
        />
        <FlatList
          data={users}
          keyExtractor={this._keyExtractor}
          renderItem={({ item, index }) => (
            <UserRow user={item} idx={index} onPress={user => this.handleRowPress(user)} />
          )}
          ListEmptyComponent={() => <Text text={"Nothing to render"} />}
          onEndReached={() => this.fetchNextPage()}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={this.renderFooter}
        />
      </Screen>
    )
  }
}
