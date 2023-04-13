import { BaseController, EndpointMethodMapping } from "../BaseController"
import { Request, Response } from 'express'
import { PostgreSQLContext } from "../../lib/dbcontext"
import { autoInjectable, inject } from "tsyringe"
import StatusCodes from 'http-status-codes'
import sha256 from "sha256"

const { OK } = StatusCodes

@autoInjectable()
export default class HomeController extends BaseController {


  public dbcontext: PostgreSQLContext
  public endpointMethod: EndpointMethodMapping = {
    "get": "GET",
    "post": "POST"
  }

  constructor(
    @inject('dbcontext') dbcontext: PostgreSQLContext
  ) {
    super()
    this.dbcontext = dbcontext
  }

  public get = async (req: Request, res: Response) => {
    const params_set = { ...req.query }
    console.log(sha256.x2('userjsdc2023'))
    console.log(sha256.x2('rogerjsdc2023'))
    return res.status(OK).json({
      ...params_set
    })
  }

  public post = async (req: Request, res: Response) => {
    const params_set = { ...req.body }
    return res.status(OK).json({
      ...params_set
    })
  }

}
