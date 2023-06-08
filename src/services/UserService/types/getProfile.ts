import { User } from "../../../entity/credential/user.entity"
import HttpStatusCode from "../../../lib/utility/httpStatusCode"

export type GetProfileParam = {
  userId: string
}

export type GetProfileResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.BadRequest
  condition: User | { response: string }
}

type GetProfile = {
  ParamType: GetProfileParam
  ResponseType: GetProfileResponse
}

export default GetProfile
