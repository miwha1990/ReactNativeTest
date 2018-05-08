import { onSnapshot } from "mobx-state-tree"
import { UsersStoreModel, UsersStore } from "../models/github-users-store"
import * as storage from "../lib/storage"

/**
 * The key we'll be saving our state as within async storage.
 */
const USERS_STATE_STORAGE_KEY = "github-users"

/**
 * Setup the root state.
 */
export async function setupUsersStore() {
  let usersStore: UsersStore
  let data: any

  try {
    // load data from storage
    data = (await storage.load(USERS_STATE_STORAGE_KEY)) || {}
    usersStore = UsersStoreModel.create(data)
  } catch {
    // if there's any problems loading, then let's at least fallback to an empty state
    // instead of crashing.
    usersStore = UsersStoreModel.create([])
  }

  // track changes & save to storage
  onSnapshot(usersStore, snapshot => storage.save(USERS_STATE_STORAGE_KEY, snapshot))

  return usersStore
}
