import { container } from "tsyringe"
import dbcontext from "../lib/dbcontext"
import {
  HomeController
} from '../controllers'
import { IController } from "../controllers/BaseController"
import { IProcess } from "../processes/BaseProcess"

container.register('dbcontext', { useValue: dbcontext })

const homeController = container.resolve(HomeController)
export const attachedControllers: IController[] = [
  homeController
]

export const attachedProcess: IProcess[] = []
