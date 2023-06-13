import { autoInjectable, inject } from "tsyringe"
import { User } from "../../entity/credential/user.entity"
import { PostgreSQLContext } from "../../lib/dbcontext"
import * as _ from 'lodash'
import ListByPage from "./types/listByPage"
import HttpStatusCode from "../../lib/utility/httpStatusCode"
import GetProfile from "./types/getProfile"
import EditProfile from "./types/editProfile"
import { isRoleCodesValid } from "../../lib/utility/isRoleCodesValid"
import { Role } from "../../entity/credential/role.entity"
import Register from "./types/register"
import ResetPassword from "./types/resetPassword"
import { IJwtPayload, JwtAuthenticator } from "../../lib/JwtAuthenticator"
import sha256 from "sha256"
import uniqid from 'uniqid'
import VerifyEmail from "./types/verifyEmail"
import { encodePassword } from "../../lib/utility/encodePassword"


@autoInjectable()
export default class UserService {

  public dbcontext: PostgreSQLContext
  public jwtAuthenticator: JwtAuthenticator

  constructor(
    @inject('dbcontext') dbcontext: PostgreSQLContext,
    @inject('jwtAuthenticator') jwtAuthenticator: JwtAuthenticator
  ) {
    this.dbcontext = dbcontext
    this.jwtAuthenticator = jwtAuthenticator
  }

  public register = async ({
    email, password, phoneNumber, sex
  }: Register['ParamType']): Promise<Register['ResponseType']> => {
    const roleRepo = this.dbcontext.connection.getRepository(Role)
    const userRepo = this.dbcontext.connection.getRepository(User)
    const role = await roleRepo.findOne({
      where: {
        code: 'user:general'
      }
    })
    if (!role) return {
      status: HttpStatusCode.InternalServerError,
      condition: { response: "內部伺服器錯誤" }
    }
    const user = new User()
    user.email = email
    user.password = encodePassword(password)
    user.phoneNumber = phoneNumber
    user.sex = sex
    user.roles = [role]
    user.verifyCode = uniqid()
    try {
      await userRepo.insert(user)
      await userRepo.save(user)
      // await this.mailer.sendRegisterVerfication({
      //   to: user.email,
      //   verifyToken: user.verifyCode
      // })
      return {
        status: HttpStatusCode.Ok,
        condition: { response: "成功" }
      }
    } catch (e) {
      console.log(e)
      return {
        status: HttpStatusCode.BadRequest,
        condition: { response: "email已被註冊" }
      }
    }
  }

  public resetPassword = async ({
    token, originPassword, newPassword
  }: ResetPassword['ParamType']): Promise<ResetPassword['ResponseType']> => {

    const { id } = this.jwtAuthenticator.verifyToken(token) as IJwtPayload
    const repo = this.dbcontext.connection.getRepository(User)
    const user = await repo.findOne({
      id: id
    })

    if (!user) return {
      status: HttpStatusCode.UnprocessableEntity,
      condition: { response: '登入逾時' }
    }
    if (user.password !== sha256.x2(originPassword)) return {
      status: HttpStatusCode.UnprocessableEntity,
      condition: { response: '原始密碼輸入錯誤' }
    }

    user.password = sha256.x2(newPassword)
    await repo.save(user)
    return {
      status: HttpStatusCode.Ok,
      condition: { response: '密碼修改成功' }
    }
  }

  public listByPage = async ({
    page, per_page, sortBy, order
  }: ListByPage['ParamType']): Promise<ListByPage['ResponseType']> => {
    if (page <= 0) return {
      status: HttpStatusCode.BadRequest,
      condition: { response: "page不可小於1" }
    }
    const repo = this.dbcontext.connection.getRepository(User)
    const skip = (per_page * page) - per_page
    const users = await repo.find({
      take: per_page, skip,
      order: { [sortBy]: order }
    })
    return {
      status: HttpStatusCode.Ok,
      condition: users
    }
  }

  public getProfile = async ({
    userId
  }: GetProfile['ParamType']): Promise<GetProfile['ResponseType']> => {
    const repo = this.dbcontext.connection.getRepository(User)
    const user = await repo.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :id', { id: userId })
      .select([
        'user.id', 'user.alias', 'user.email', 'user.phoneNumber', 'user.sex',
        'user.lastLoginAt', 'roles.id', 'roles.name', 'roles.code'
      ])
      .getOne()
    if (!user) return { status: HttpStatusCode.BadRequest, condition: { response: '無效的使用者Id' } }
    return { status: HttpStatusCode.Ok, condition: user }
  }

  public editProfile = async ({
    userId, modifyUserId, alias,
    roleCodes, phoneNumber
  }: EditProfile['ParamType']): Promise<EditProfile['ResponseType']> => {

    const { parsedRoleCodes: roleCodesArr, isValid } = isRoleCodesValid(roleCodes)

    if (!isValid) return {
      status: HttpStatusCode.BadRequest,
      condition: { response: '無效的角色編碼' }
    }

    const repo = this.dbcontext.connection.getRepository(User)
    const roleRepo = this.dbcontext.connection.getRepository(Role)
    const user = await repo.createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :id', { id: modifyUserId })
      .getOne()

    if (!user) return {
      status: HttpStatusCode.BadRequest,
      condition: { response: '無效的使用者Id' }
    }

    const roleEntities: Role[] = []
    for (let i = 0; i < roleCodesArr.length; i++) {
      const roleCode = roleCodesArr[i]
      const role = await roleRepo.findOne({
        where: {
          code: roleCode
        }
      })
      if (!role) return {
        status: HttpStatusCode.BadRequest,
        condition: { response: `無效的角色編碼: ${roleCode}` }
      }
      roleEntities.push(role)
    }
    user.alias = alias
    user.roles = roleEntities
    user.phoneNumber = phoneNumber
    await repo.save(user)

    return {
      status: HttpStatusCode.Ok,
      condition: { response: '成功' }
    }

  }

  public verifyEmail = async ({
    email, verifyToken
  }: VerifyEmail['ParamType']): Promise<VerifyEmail['ResponseType']> => {
    const userRepo = this.dbcontext.connection.getRepository(User)

    const user = await userRepo.findOne({
      email: email
    })
    if (!user) return {
      status: HttpStatusCode.BadRequest,
      condition: { response: "查無此使用者" }
    }

    if (user.verifyCode !== verifyToken) return {
      status: HttpStatusCode.BadRequest,
      condition: { response: "無效的驗證碼" }
    }

    user.isVerified = true
    await userRepo.save(user)

    return {
      status: HttpStatusCode.Ok,
      condition: { response: "驗證成功!" }
    }
  }

}