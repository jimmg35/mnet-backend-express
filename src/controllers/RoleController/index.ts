import {
  BaseController,
  EndpointCustomRouteMapping,
  EndpointMethodMapping,
  EndpointMiddlewareMapping
} from "../BaseController"
import { authMiddleware } from '../../di'
import { Request, Response } from 'express'
import { ApiRightEnum } from "../../types/rbac"
import { autoInjectable, inject } from "tsyringe"
import { PostgreSQLContext } from "../../lib/dbcontext"
import { Role } from "../../entity/credential/role.entity"
import HttpStatusCode from "../../lib/utility/httpStatusCode"


@autoInjectable()
export default class RoleController extends BaseController {


  public dbcontext: PostgreSQLContext
  public endpointMethod: EndpointMethodMapping = {
    "list": "GET"
  }
  public endpointMiddleware: EndpointMiddlewareMapping = {
    // "list": [
    //   authMiddleware.isUserLogin,
    //   authMiddleware.isUserHasPermission(ApiRightEnum.RoleList)
    // ]
  }
  public endpointCustomRoute: EndpointCustomRouteMapping = {
    'list': '/list'
  }

  constructor(
    @inject('dbcontext') dbcontext: PostgreSQLContext
  ) {
    super()
    this.dbcontext = dbcontext
  }

  public list = async (req: Request, res: Response) => {
    const repo = this.dbcontext.connection.getRepository(Role)
    const roles = await repo.find()
    return res.status(HttpStatusCode.Ok).json(roles)
  }

}
