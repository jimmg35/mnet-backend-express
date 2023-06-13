import {
  BaseController,
  EndpointCustomRouteMapping,
  EndpointMethodMapping,
  EndpointMiddlewareMapping
} from "../BaseController"
import { authMiddleware } from "../../di"
import { Request, Response } from 'express'
import { autoInjectable, inject } from "tsyringe"
import { PostgreSQLContext } from "../../lib/dbcontext"
import { ApiRightEnum, RoleEnum } from "../../types/rbac"
import { User } from "../../entity/credential/user.entity"
import { Role } from "../../entity/credential/role.entity"
import { isRoleCodesValid } from "../../lib/utility/isRoleCodesValid"
import HttpStatusCode from "../../lib/utility/httpStatusCode"
import UserService from "../../services/UserService"
import ListByPage from "../../services/UserService/types/listByPage"
import Register from "../../services/UserService/types/register"
import ResetPassword from "../../services/UserService/types/resetPassword"
import VerifyEmail from "../../services/UserService/types/verifyEmail"


@autoInjectable()
export default class UserController extends BaseController {


  public dbcontext: PostgreSQLContext
  public userService: UserService
  public endpointMethod: EndpointMethodMapping = {
    "register": "POST",
    "resetPassword": "PUT",
    "list": "GET",
    "listProfile": "GET",
    'editProfile': 'PUT',
    "verifyEmail": "GET",
  }
  public endpointMiddleware: EndpointMiddlewareMapping = {
    "resetPassword": [
      authMiddleware.authenticateToken,
      authMiddleware.authenticatePermission(ApiRightEnum.UserPasswordReset)
    ],
    "list": [
      authMiddleware.authenticateToken,
      authMiddleware.authenticatePermission(ApiRightEnum.UserList)
    ],
    "listProfile": [
      authMiddleware.authenticateToken,
      authMiddleware.authenticatePermission(ApiRightEnum.UserProfileList)
    ],
    "editProfile": [
      authMiddleware.authenticateToken,
      authMiddleware.authenticatePermission(ApiRightEnum.UserProfileEdit)
    ]
  }
  public endpointCustomRoute: EndpointCustomRouteMapping = {
    'resetPassword': '/password/reset',
    'list': '/list',
    'listProfile': '/:modifiedUserId/profile',
    'editProfile': '/:modifiedUserId/profile/edit'
  }

  constructor(
    @inject('dbcontext') dbcontext: PostgreSQLContext,
    @inject('userService') userService: UserService
  ) {
    super()
    this.dbcontext = dbcontext
    this.userService = userService
  }

  public register = async (req: Request, res: Response) => {
    const {
      email, password, phoneNumber, sex
    } = { ...req.body } as Register['ParamType']
    const { status, condition } = await this.userService.register({
      email, password, phoneNumber, sex
    })
    return res.status(status).json(condition)
  }

  public resetPassword = async (req: Request, res: Response) => {
    const { authorization } = { ...req.headers } as { authorization: string }
    const { originPassword, newPassword } = { ...req.body } as ResetPassword['ParamType']
    const { status, condition } = await this.userService.resetPassword({
      originPassword, newPassword, token: authorization
    })
    return res.status(status).json(condition)
  }

  public list = async (req: Request, res: Response) => {
    const {
      page, per_page, sortBy, order
    } = { ...req.query } as unknown as ListByPage['ParamType']
    const { status, condition } = await this.userService.listByPage({
      page, per_page, sortBy, order
    })
    return res.status(status).json(condition)
  }

  public listProfile = async (req: Request, res: Response) => {
    const userId = req.params.modifiedUserId
    const { status, condition } = await this.userService.getProfile({
      userId
    })
    return res.status(status).json(condition)
  }

  public editProfile = async (req: Request, res: Response) => {
    const modifyUserId = req.params.modifiedUserId
    const { userId, alias, roleCodes, phoneNumber } = { ...req.body } as {
      userId: string | undefined, alias: string, roleCodes: RoleEnum[], phoneNumber: string | null
    }
    const { status, condition } = await this.userService.editProfile({
      userId, modifyUserId, alias, roleCodes, phoneNumber
    })
    return res.status(status).json(condition)
  }

  public verifyEmail = async (req: Request, res: Response) => {
    const { email, verifyToken } = { ...req.query } as unknown as VerifyEmail['ParamType']
    const { status, condition } = await this.userService.verifyEmail({
      email, verifyToken
    })
    return res.status(status).json(condition)
  }

}
