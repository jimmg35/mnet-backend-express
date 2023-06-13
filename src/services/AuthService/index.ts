import { autoInjectable, inject } from "tsyringe"
import { User } from "../../entity/credential/user.entity"
import { PostgreSQLContext } from "../../lib/dbcontext"
import { JwtAuthenticator, IJwtPayload } from "../../lib/JwtAuthenticator"
import { encodePassword } from "../../lib/utility/encodePassword"
import AuthenticateUser from "./types/authenticateUser"
import AuthenticateToken from "./types/authenticateToken"
import moment from "moment"
import HttpStatusCode from "../../lib/utility/httpStatusCode"
import AuthenticatePermission from "./types/authenticatePermission"
import * as _ from 'lodash'
import AuthenticateRoute from "./types/authenticateRoute"

@autoInjectable()
export default class AuthService {

  public dbcontext: PostgreSQLContext
  public jwtAuthenticator: JwtAuthenticator

  constructor(
    @inject('dbcontext') dbcontext: PostgreSQLContext,
    @inject('jwtAuthenticator') jwtAuthenticator: JwtAuthenticator
  ) {
    this.dbcontext = dbcontext
    this.jwtAuthenticator = jwtAuthenticator
  }

  public authenticateUser = async ({
    email, password
  }: AuthenticateUser['ParamType']): Promise<AuthenticateUser['ResponseType']> => {
    const repo = this.dbcontext.connection.getRepository(User)
    const user = await repo.findOne({ where: { email: email } })
    if (!user) return { status: HttpStatusCode.NotFound, condition: { response: '查無此使用者' } }
    if (user.password !== encodePassword(password)) return {
      status: HttpStatusCode.Unauthorized,
      condition: { response: '密碼錯誤' }
    }
    if (!user.isVerified) return {
      status: HttpStatusCode.Unauthorized,
      condition: { response: '請去電子信箱驗證帳號' }
    }
    const token = this.jwtAuthenticator.signToken(user)
    if (!token) return { status: HttpStatusCode.InternalServerError, condition: { response: '伺服器內部錯誤' } }
    user.lastLoginAt = moment(new Date()).toDate()
    await repo.save(user)
    return { status: HttpStatusCode.Ok, condition: { response: token } }
  }

  public authenticateToken = async ({
    token
  }: AuthenticateToken['ParamType']): Promise<AuthenticateToken['ResponseType']> => {
    if (!token) return { status: HttpStatusCode.Unauthorized, condition: { response: '無權限' } }
    const payload = this.jwtAuthenticator.verifyToken(token) as IJwtPayload
    if (!payload) return { status: HttpStatusCode.Unauthorized, condition: { response: '登入逾時' } }
    return { status: HttpStatusCode.Ok, condition: payload }
  }

  public authenticatePermission = async ({
    userId, api
  }: AuthenticatePermission['ParamType']): Promise<AuthenticatePermission['ResponseType']> => {
    if (!userId) return {
      status: HttpStatusCode.InternalServerError,
      condition: {
        response: `內部伺服器錯誤:developer error: need to verify if user logged in, 
      add isUserLogin middleware before this one` }
    }
    const repo = this.dbcontext.connection.getRepository(User)
    const user = await repo
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect("roles.apirights", "apirights")
      .getOne()
    if (!user) return {
      status: HttpStatusCode.Unauthorized,
      condition: { response: '無效的使用者Id' }
    }
    const apiCodesArray = user.roles.map(r => r.apirights.map(a => a.code))
    const apiCodes = _
      .chain(apiCodesArray)
      .flatten()
      .uniq()
      .value()
    if (!apiCodes.includes(api)) return {
      status: HttpStatusCode.Unauthorized,
      condition: { response: '權限不足' }
    }
    return {
      status: HttpStatusCode.Ok,
      condition: { response: '成功' }
    }
  }

  public authenticateRoute = async ({
    userId, pageName
  }: AuthenticateRoute['ParamType']): Promise<AuthenticateRoute['ResponseType']> => {
    const repo = this.dbcontext.connection.getRepository(User)
    const user = await repo.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .leftJoinAndSelect('roles.pagerights', 'pagerights')
      .where('user.id = :id', { id: userId })
      .getOne()
    if (!user) return {
      status: HttpStatusCode.Unauthorized,
      condition: { response: '權限不足' }
    }

    for (let i = 0; i < user.roles.length; i++) {
      const role = user.roles[i]
      for (let j = 0; j < role.pagerights.length; j++) {
        const pageRight = role.pagerights[j]
        if (pageName === pageRight.code) return {
          status: HttpStatusCode.Ok,
          condition: { response: '通過' }
        }
      }
    }
    return {
      status: HttpStatusCode.Unauthorized,
      condition: { response: '權限不足' }
    }

  }


}