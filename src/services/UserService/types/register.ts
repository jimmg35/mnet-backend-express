import { User } from "../../../entity/credential/user.entity"
import HttpStatusCode from "../../../lib/utility/httpStatusCode"
import { UserSex } from "../../../types/rbac"

export type RegisterParam = {
  email: string
  password: string
  phoneNumber: string
  sex: UserSex
}

export type RegisterResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.BadRequest | HttpStatusCode.InternalServerError
  condition: User[] | { response: string }
}

type Register = {
  ParamType: RegisterParam
  ResponseType: RegisterResponse
}

export default Register
