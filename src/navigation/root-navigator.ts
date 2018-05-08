import { StackNavigator } from "react-navigation"
import { GithubUserFollowers } from "../views/github-users/github-user-followers"
import { GithubUsersList } from "../views/github-users/github-users-list"

export const RootNavigator = StackNavigator(
  {
    GithubUsersListNavigator: { screen: GithubUsersList },
    GithubUserFollowersNavigator: { screen: GithubUserFollowers },
  },
  {
    headerMode: "none",
    navigationOptions: { gesturesEnabled: false },
  },
)
