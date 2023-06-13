import jwt from "jsonwebtoken"
import { autoInjectable, container } from 'tsyringe'
import { User } from "../entity/credential/user.entity"

export interface IJwtPayload {
  id: string
  alias: string | null
  email: string
  lastLoginAt: Date | null
}

@autoInjectable()
export class JwtAuthenticator {

  private readonly jwtSecret: string | undefined
  private readonly jwtExpiresIn: number | undefined

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET
    this.jwtExpiresIn = Number(process.env.JWT_EXPIRE_SECOND)
  }

  public signToken = (
    user: User
  ) => {
    if (!this.jwtSecret || !this.jwtExpiresIn) return undefined
    const token = jwt.sign(
      {
        id: user.id,
        alias: user.alias,
        email: user.email,
        lastLoginAt: user.lastLoginAt
      }, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn
    })
    return token
  }

  public verifyToken = (
    authorization: string
  ) => {
    if (!this.jwtSecret) return undefined
    const token = authorization.replace(/^Bearer\s+/, "")
    try {
      const payload = jwt.verify(token, this.jwtSecret)
      return payload
    } catch {
      return undefined
    }
  }
}

const jwtAuthenticator = container.resolve(JwtAuthenticator)
export default jwtAuthenticator

