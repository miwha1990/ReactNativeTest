import { types } from "mobx-state-tree"
import {fetchUsers, fetchFollowers} from "../../api"

import {Api} from "../../services/api"

const api = new Api()
api.setup()

const User = types.model({
  login: types.string,
  id: types.number,
  avatar_url: types.string,
  html_url: types.string,
  followers_url: types.string,
})

const UserFollowers = types.model({
  followers: types.optional(types.array(User), []),
  id: types.number,
})
const UserArray =  types.optional(types.array(User), [])
const UserArrayOfObjects=  types.optional(types.array(UserFollowers), [])

const UsersStore = types.model({
  users: UserArray,
  isLoading: false,
  adding: false,
  followers: UserArrayOfObjects,
})
  .actions((self) => {
    return {
      markLoading(loading) {
        self.isLoading = loading
      },
      markAdding(loading) {
        self.adding = loading
      },
      updateUsers(data) {
        self.users = data.users
      },
      nextPageUsers(data) {
        self.users.push(...data.users)
      },
      cleanFollowersStack() {
        self.followers.pop()
      },
      updateFollowers(id, value) {
        self.followers.push({id, followers: value.followers})
      },
      nextPageFollowers(data) {
        const targetArray = self.followers[self.followers.length - 1]
        if(data.length) {
          targetArray.push(...data.followers)
        }
      },
      async fetchFollowers (params: {url: string, id: number}) {
        self.markLoading(true)
        const data = await api.fetchFollowers(params.url)
        self.updateFollowers(params.id, data)
        self.markLoading(false)
      },
      async fetchUsers () {
        self.markLoading(true)
        const data = await api.fetchUsers()
        self.updateUsers(data)
        self.markLoading(false)
      },
      async addUsers (since: number) {
        self.markAdding(true)
        const data = await api.fetchUsers(since)
        self.nextPageUsers(data)
        self.markAdding(false)
      },
      async addFollowers (url: string, since: number) {
        self.markAdding(true)
        const data = await api.fetchFollowers(url, since)
        self.nextPageFollowers(data)
        self.markAdding(false)
      },
    }
})
/**
 * An RootStore model.
 */
export const UsersStoreModel = types.model("UsersStore").props({
  usersStore: types.optional(UsersStore, {}),
})

/**
 * The RootStore instance.
 */
export type UsersStore = typeof UsersStoreModel.Type
