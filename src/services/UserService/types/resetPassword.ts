import HttpStatusCode from "../../../lib/utility/httpStatusCode"

export type ResetPasswordParam = {
  token: string
  originPassword: string
  newPassword: string
}

export type ResetPasswordResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.UnprocessableEntity
  condition: { response: string }
}

type ResetPassword = {
  ParamType: ResetPasswordParam
  ResponseType: ResetPasswordResponse
}

export default ResetPassword
