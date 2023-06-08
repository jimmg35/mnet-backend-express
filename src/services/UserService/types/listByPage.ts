import { User } from "../../../entity/credential/user.entity"
import HttpStatusCode from "../../../lib/utility/httpStatusCode"

export type ListByPageParam = {
  page: number
  per_page: number
  sortBy: 'alias' | 'email' | 'lastLoginAt'
  order: 'DESC' | 'ASC'
}

export type ListByPageResponse = {
  status: HttpStatusCode.Ok | HttpStatusCode.BadRequest
  condition: User[] | { response: string }
}

type ListByPage = {
  ParamType: ListByPageParam
  ResponseType: ListByPageResponse
}

export default ListByPage
