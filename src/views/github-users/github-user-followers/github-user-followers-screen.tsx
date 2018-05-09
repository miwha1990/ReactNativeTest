import * as React from "react"
import { action, observable } from "mobx"
import { FlatList, View, ActivityIndicator } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { observer, inject } from "mobx-react"

import { Text } from "../../shared/text"
import { Screen } from "../../shared/screen"
import { UserRow } from "../../components/user-row"
import ListHeader from "../../components/ListHeader"
import { Header } from "../../shared/header"

export interface RegisterScreenProps extends NavigationScreenProps<{}> {}

@inject("usersStore")
@observer
export class GithubUserFollowers extends React.Component<RegisterScreenProps, {}> {
  _keyExtractor = (item, index) => index.toString()

  componentDidMount() {
    this.getUsers()
  }

  @action.bound
  getUsers() {
    const {
      usersStore: { fetchFollowers },
      navigation: { state },
    } = this.props
    if (state && state.params) {
      const data = {
        id: state.params.user.id,
        url: state.params.user.followers_url,
      }
      fetchFollowers(data)
    }
  }

  handleRowPress(user) {
    this.props.navigation.navigate("GithubUserFollowersNavigator", { user })
  }

  handleBackButton() {
    this.props.navigation.goBack()
  }

  fetchNextPage() {
    const {
      usersStore: { addFollowers, followers },
      navigation: { state },
    } = this.props
    let lastUserId = 0
    if (state && state.params) {
      let temp = followers[followers.length - 1].followers
      lastUserId = temp[temp.length - 1].id
      addFollowers(state.params.user.followers_url, lastUserId)
    }
  }

  componentWillUnmount() {
    this.props.usersStore.cleanFollowersStack()
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
      usersStore: { followers, isLoading },
      navigation: { state },
    } = this.props
    let list_data = []
    if (followers.length) {
      list_data = followers[followers.length - 1].followers
    }
    let headerTitle = "User`s followers"
    if (state && state.params) {
      headerTitle = `${state.params.user.login.toUpperCase()}'s followers`
    }
    return isLoading ? (
      <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
    ) : (
      <Screen preset="fixedCenter">
        <Header
          headerText={headerTitle}
          titleStyle={{ fontSize: 17, fontWeight: "900" }}
          style={{ backgroundColor: "#fff", paddingTop: 26 }}
          leftIcon={"back"}
          onLeftPress={() => this.handleBackButton()}
        />
        <FlatList
          data={list_data}
          keyExtractor={this._keyExtractor}
          renderItem={({ item, index }) => (
            <UserRow user={item} idx={index} onPress={user => this.handleRowPress(user)} />
          )}
          ListEmptyComponent={() => <Text text={"Nothing to render"} />}
          onEndReached={() => this.fetchNextPage()}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={this.renderFooter}
        />
        )}
      </Screen>
    )
  }
}
