import { types, getParent } from "mobx-state-tree"
import {fetchUsers, fetchFollowers} from "../../api"

import {Api} from "../../services/api"

const api = new Api()
api.setup()

const User = types.model({
  login: types.string,
  avatar_url: types.string,
  html_url: types.string,
  followers_url: types.string,
})
  .views(self => ({
    get UsersList() {
      return getParent(self)
    },
  }))

const UsersStore = types.model({
  users: types.optional(types.array(User), []),
  isLoading: false,
  adding: false,
  followers: types.optional(types.array(User), []),
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
        self.users = [...self.users, ...data.users]
      },
      updateFollowers(data) {debugger
        self.followers = data.followers
      },
      nextPageFollowers(data) {
        if(data.length) {
          self.users = [...self.followers, ...data.followers]
        }
      },
      async fetchFollowers (url: string, page: number, per_page: number) {
        self.markLoading(true)
        const data = await api.fetchFollowers(url, page, per_page)
        self.updateFollowers(data)
        self.markLoading(false)
      },
      async fetchUsers (page: number, per_page: number) {
        self.markLoading(true)
        const data = await api.fetchUsers(page, per_page)
        self.updateUsers(data)
        self.markLoading(false)
      },
      async addUsers (page: number, per_page: number) {
        self.markAdding(true)
        const data = await api.fetchUsers(page, per_page)
        self.nextPageUsers(data)
        self.markAdding(false)
      },
      async addFollowers (url: string, page: number, per_page: number) {
        self.markAdding(true)
        const data = await api.fetchFollowers(url, page, per_page)
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
