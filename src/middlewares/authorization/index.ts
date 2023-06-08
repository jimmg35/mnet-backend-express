import { Request, Response, NextFunction } from 'express'
import { autoInjectable, inject } from "tsyringe"
import { User } from '../../entity/credential/user.entity'
import { PostgreSQLContext } from '../../lib/dbcontext'
import { IJwtPayload, JwtAuthenticator } from '../../lib/JwtAuthenticator'
import { ApiRightEnum } from '../../types/rbac'

import HttpStatusCode from '../../lib/utility/httpStatusCode'
import { AuthService } from '../../services'

@autoInjectable()
export default class AuthMiddleware {

  public authService: AuthService

  constructor(
    @inject('authService') authService: AuthService
  ) {
    this.authService = authService
  }

  public authenticateToken = async (
    req: Request, res: Response, next: NextFunction
  ) => {
    const { authorization } = { ...req.headers }
    const {
      status, condition
    } = await this.authService.authenticateToken({ token: authorization })
    if (status === HttpStatusCode.Unauthorized)
      return res.status(status).json({ response: 'invalid token' })
    if ('id' in condition)
      req.body.userId = condition.id
    next()
  }

  public authenticatePermission = (api: ApiRightEnum) => {
    return async (
      req: Request, res: Response, next: NextFunction
    ) => {
      const { userId } = { ...req.body } as { userId: string | undefined }
      const {
        status, condition
      } = await this.authService.authenticatePermission({
        userId, api
      })
      if (status !== HttpStatusCode.Ok)
        return res.status(status).json({ response: condition })
      next()
    }
  }

}