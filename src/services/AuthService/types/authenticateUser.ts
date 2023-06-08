import HttpStatusCode from "../../../lib/utility/httpStatusCode"

export type AuthenticateUserParam = {
  email: string
  password: string
}

export type AuthenticateUserResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.NotFound | HttpStatusCode.Unauthorized | HttpStatusCode.InternalServerError
  condition: { response: string }
}

type AuthenticateUser = {
  ParamType: AuthenticateUserParam
  ResponseType: AuthenticateUserResponse
}

export default AuthenticateUser
