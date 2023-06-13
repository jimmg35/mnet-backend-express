import HttpStatusCode from "../../../lib/utility/httpStatusCode"
import { IJwtPayload } from "../../../lib/JwtAuthenticator"

export type AuthenticateTokenParam = {
  token: string | undefined
}

export type AuthenticateTokenResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.Unauthorized
  condition: IJwtPayload | { response: string }
}

type AuthenticateToken = {
  ParamType: AuthenticateTokenParam
  ResponseType: AuthenticateTokenResponse
}

export default AuthenticateToken
