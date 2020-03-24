import axios from 'axios';
import { apiBase } from './ApiConfig';

axios.defaults.baseURL = apiBase;

type LinkedAccount = {
  id: string,
  type: string,
  serviceName: string
}

type User = {
  id: string,
  username: string,
  email: string,
  linkedAccounts: Array<LinkedAccount>
}

export type Result = {
  user?: User
  status: number,
  valid: boolean
}

export default class UserHanlder {
    readonly user?: User;
    readonly token: string;
    readonly api: any;

    constructor(readonly auth: string) {
      // then try and decode the jwt using jwt-decode
      this.token = auth

      this.api = axios.create({
        headers: {
          post: {        // can be common or any other method
            Authorization: `Bearer ${auth}`
          }
        }
      })
    }

    fetchUser = async (): Promise<Result> => {
      let response: { status: number; body: any; } = await this.api.post('/auth/get/user')

      if (response.status == 200) {
        return {
          user: response.body,
          status: response.status,
          valid: true
        }
      }

      return {
        status: response.status,
        valid: false
      }
    }
  
    get authorizationString() {
      return `Bearer ${this.token}`;
    }
  }