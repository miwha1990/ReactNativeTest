import { GeneralApiProblem } from "./api-problem"
import {array} from "mobx-state-tree/dist/types/complex-types/array"

export interface Repo {
  id: number
  name: string
  owner: string
}

export interface User {
  login: string,
  avatar_url: string,
  html_url: string,
  followers_url: string,
}

export type GetRepoResult = { kind: "ok"; repo: Repo } | GeneralApiProblem
export type GetUserResult = { kind: "ok"; user: User } | GeneralApiProblem
export type GetUsersListResult = { kind: "ok"; usersList: array } | GeneralApiProblem
