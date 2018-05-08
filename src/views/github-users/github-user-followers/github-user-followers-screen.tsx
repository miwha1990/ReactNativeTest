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
      usersStore: { fetchFollowers },
      navigation: { state },
    } = this.props
    if (state && state.params) {
      fetchFollowers(state.params.user.followers_url)
    }
  }

  handleRowPress(user) {
    this.props.navigation.navigate("GithubUserFollowersNavigator", { user })
  }

  handleBackButton() {
    this.props.navigation.goBack()
  }

  fetchNextPage() {
    this.nextPage()
    const {
      usersStore: { addFollowers },
      navigation: { state },
    } = this.props
    if (state && state.params) {
      addFollowers(state.params.user.followers_url, this.page)
    }
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
          data={followers}
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
