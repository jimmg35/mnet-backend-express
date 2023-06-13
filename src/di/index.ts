import { container } from "tsyringe"
import dbcontext from "../lib/dbcontext"
import jwtAuthenticator from "../lib/JwtAuthenticator"
import {
  HomeController,
  AuthController,
  UserController,
  RoleController,
  AprController
} from '../controllers'
import { IController } from "../controllers/BaseController"
import { IProcess } from "../processes/BaseProcess"
import { AuthService, UserService } from "../services"
import AuthMiddleware from "../middlewares/authorization"

// step1. register essential lib blocks
container.register('dbcontext', { useValue: dbcontext })
container.register('jwtAuthenticator', { useValue: jwtAuthenticator })

// step2. resolve and register services used in controllers and middlewares
const authService = container.resolve(AuthService)
const userService = container.resolve(UserService)
container.register('authService', { useValue: authService })
container.register('userService', { useValue: userService })

// step3. resolving middlewares used in controllers
export const authMiddleware = container.resolve(AuthMiddleware)


const homeController = container.resolve(HomeController)
const authController = container.resolve(AuthController)
const userController = container.resolve(UserController)
const roleController = container.resolve(RoleController)
const aprController = container.resolve(AprController)
export const attachedControllers: IController[] = [
  homeController, authController, userController, roleController,
  aprController
]

export const attachedProcess: IProcess[] = []
