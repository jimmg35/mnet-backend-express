import HttpStatusCode from "../../../lib/utility/httpStatusCode"
import { RoleEnum } from "../../../types/rbac"

export type EditProfileParam = {
  userId: string | undefined
  modifyUserId: string
  alias: string
  roleCodes: RoleEnum[]
  phoneNumber: string | null
}

export type EditProfileResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.BadRequest
  condition: { response: string }
}

type EditProfile = {
  ParamType: EditProfileParam
  ResponseType: EditProfileResponse
}

export default EditProfile
