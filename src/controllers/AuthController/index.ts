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
import { User } from "../../entity/credential/user.entity"
import { JwtAuthenticator } from "../../lib/JwtAuthenticator"
import HttpStatusCode from "../../lib/utility/httpStatusCode"
import { AuthService } from "../../services"
import { PageRightEnum } from "../../types/rbac"


@autoInjectable()
export default class AuthController extends BaseController {


  public authService: AuthService
  public endpointMethod: EndpointMethodMapping = {
    "authenticate": "POST",
    "validate": "POST",
    "validateRoute": "POST"
  }
  public endpointMiddleware: EndpointMiddlewareMapping = {
    "validateRoute": [
      authMiddleware.authenticateToken
    ]
  }
  public endpointCustomRoute: EndpointCustomRouteMapping = {
    "validateRoute": "/validate/route"
  }

  constructor(
    @inject('authService') authService: AuthService
  ) {
    super()
    this.authService = authService
  }

  public authenticate = async (req: Request, res: Response) => {
    const { email, password } = { ...req.body } as {
      email: string, password: string
    }
    const { status, condition } = await this.authService.authenticateUser({
      email, password
    })
    return res.status(status).json(condition)
  }

  public validate = async (req: Request, res: Response) => {
    const { authorization } = { ...req.headers } as { authorization: string }
    const { status, condition } = await this.authService.authenticateToken({
      token: authorization
    })
    return res.status(status).json(condition)
  }

  public validateRoute = async (req: Request, res: Response) => {
    const { userId, pageName } = { ...req.body } as { userId: string, pageName: PageRightEnum }
    const { status, condition } = await this.authService.authenticateRoute({
      userId, pageName
    })
    return res.status(status).json(condition)
  }

}
