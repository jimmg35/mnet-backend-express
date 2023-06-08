import HttpStatusCode from "../../../lib/utility/httpStatusCode"
import { ApiRightEnum } from "../../../types/rbac"

export type AuthenticatePermissionParam = {
  userId: string | undefined
  api: ApiRightEnum
}

export type AuthenticatePermissionResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.Unauthorized | HttpStatusCode.InternalServerError
  condition: { response: string }
}

type AuthenticatePermission = {
  ParamType: AuthenticatePermissionParam
  ResponseType: AuthenticatePermissionResponse
}

export default AuthenticatePermission
