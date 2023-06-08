import HttpStatusCode from "../../../lib/utility/httpStatusCode"
import { PageRightEnum } from "../../../types/rbac"

export type AuthenticateRouteParam = {
  userId: string | undefined
  pageName: PageRightEnum
}

export type AuthenticateRouteResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.Unauthorized | HttpStatusCode.InternalServerError
  condition: { response: string }
}

type AuthenticateRoute = {
  ParamType: AuthenticateRouteParam
  ResponseType: AuthenticateRouteResponse
}

export default AuthenticateRoute
