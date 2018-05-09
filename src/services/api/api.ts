import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"
import {array} from "mobx-state-tree/dist/types/complex-types/array"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    })
  }

  /**
   * Gets a list of users.
   * @param {number} since
   * @returns {Promise<GetUsersListResult>}
   */
  async fetchUsers(since: number = 0): Promise<Types.GetUsersListResult> {
    const response: ApiResponse<any> =
      await this.apisauce.get(`${this.config.url}/users?since=${since}`)
    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const resultUsersList: array<Types.User> = response.data.map(({avatar_url, followers_url, html_url, login, id}) => ({
        id,
        avatar_url,
        followers_url,
        html_url,
        login,
      }))
      return { kind: "ok", users: resultUsersList }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of followers.
   * @param {string} url
   * @param {number} since
   * @returns {Promise<GetUsersListResult>}
   */
  async fetchFollowers(url: string, since: number = 0): Promise<Types.GetUsersListResult> {

    const response: ApiResponse<any> = await this.apisauce.get(`${url}?since=${since}`)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultFollowersList: array<Types.User> = response.data
      return { kind: "ok", followers: resultFollowersList }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a list of repos.
   * @param {string} repo
   * @returns {Promise<GetRepoResult>}
   */
  async getRepo(repo: string): Promise<Types.GetRepoResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/repos/${repo}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultRepo: Types.Repo = {
        id: response.data.id,
        name: response.data.name,
        owner: response.data.owner.login,
      }
      return { kind: "ok", repo: resultRepo }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
