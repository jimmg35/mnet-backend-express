import { User } from "../../../entity/credential/user.entity"
import HttpStatusCode from "../../../lib/utility/httpStatusCode"

export type VerifyEmailParam = {
  email: string
  verifyToken: string
}

export type VerifyEmailResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.BadRequest
  condition: { response: string }
}

type VerifyEmail = {
  ParamType: VerifyEmailParam
  ResponseType: VerifyEmailResponse
}

export default VerifyEmail
