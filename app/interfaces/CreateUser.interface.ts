export interface ICreateUser {
  name: string
  email: string
  password: string
  password_confirmation: string
}
export interface IUserData {
  id: number
  name: string
  email: string
  alias: string
  birth_date: string
  gender_id: number
  department_id: number
  email_verified_at: string | null
  avatar: string | null
  remember_token: string | null
  google_id: string | null
  gender: {
    id: number
    gender: string
  }
  department: {
    id: number
    department_name: string
  }
}

export interface IGetGeneralUser {
  data?: IUserData
}

export interface ICreateUserInfo {
  alias: string
  birth_date: string
  gender_id: string
  department_id: string
}

export interface IUpdateUserInfo {
  name?: string
  birth_date?: string
  email?: string
}

export interface IResetPassword {
  code: string
  email: string
  password?: string
  password_confirmation?: string
}

export interface ICreateUserInterests {
  interest_ids: number[]
}

export interface IEmail {
  email: string
}
