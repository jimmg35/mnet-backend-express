import { Response, Router, Request, NextFunction } from 'express'

export type HTTPMETHOD = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "COPY" | "OPTIONS"

export type Middleware = (req: Request, res: Response, next: NextFunction) => void

export interface EndpointMethodMapping { [methodName: string]: HTTPMETHOD }
export interface EndpointMiddlewareMapping { [methodName: string]: Middleware | Middleware[] }
export interface EndpointCustomRouteMapping { [route: string]: string }

export interface IBaseControllerParam {
  endpointMethod: EndpointMethodMapping
  endpointMiddleware?: EndpointMiddlewareMapping
  endpointCustomRoute?: EndpointCustomRouteMapping
}

export interface IController {
  routerName: string
  endpointMethod: EndpointMethodMapping
  endpointMiddleware?: { [methodName: string]: Middleware | Middleware[] }
  endpointCustomRoute?: { [route: string]: string }
  getRouter (): Router
  setRouterName_HiddenMethod (): void
  bindRouter_HiddenMethod (
    routeName: string,
    routeHandler: any,
    httpMethod: HTTPMETHOD,
    middleware?: Middleware | Middleware[],
    customRoute?: string
  ): void
  // injectDbContexts(dbcontexts: Array<DbContext>): void
}

export class BaseController implements IController {
  protected _router: Router
  public routerName: string
  public endpointMethod: EndpointMethodMapping
  public endpointMiddleware: { [methodName: string]: Middleware | Middleware[] } | undefined
  public endpointCustomRoute: { [route: string]: string } | undefined

  constructor(options: IBaseControllerParam =
    {
      endpointMethod: {},
      endpointMiddleware: {},
      endpointCustomRoute: {}
    }
  ) {
    this._router = Router()
    this.setRouterName_HiddenMethod()
    this.endpointMethod = options.endpointMethod
    this.endpointMiddleware = options.endpointMiddleware
    this.endpointCustomRoute = options.endpointCustomRoute
  }

  public setRouterName_HiddenMethod = (): void => {
    this.routerName = '/'
    this.routerName += this.constructor.name.replace(/Controller/g, "")
  }

  public bindRouter_HiddenMethod = (
    routeName: string,
    routeHandler: any,
    httpMethod: HTTPMETHOD,
    middleware?: Middleware | Middleware[],
    customRoute?: string
  ): void => {
    const undefinedMiddleware: Middleware = (req: Request, res: Response, next: NextFunction) => {
      next()
    }
    switch (httpMethod) {
      case "GET":
        this._router.get(
          customRoute ? customRoute : '/' + routeName,
          middleware ? middleware : undefinedMiddleware,
          routeHandler
        )
        break;
      case "POST":
        this._router.post(
          customRoute ? customRoute : '/' + routeName,
          middleware ? middleware : undefinedMiddleware,
          routeHandler
        )
        break;
      case "PUT":
        this._router.put(
          customRoute ? customRoute : '/' + routeName,
          middleware ? middleware : undefinedMiddleware,
          routeHandler
        )
        break;
      case "PATCH":
        this._router.patch(
          customRoute ? customRoute : '/' + routeName,
          middleware ? middleware : undefinedMiddleware,
          routeHandler
        )
        break;
      case "DELETE":
        this._router.delete(
          customRoute ? customRoute : '/' + routeName,
          middleware ? middleware : undefinedMiddleware,
          routeHandler
        )
        break;
      case "COPY":
        this._router.copy(
          customRoute ? customRoute : '/' + routeName,
          middleware ? middleware : undefinedMiddleware,
          routeHandler
        )
        break;
      case "OPTIONS":
        this._router.options(
          customRoute ? customRoute : '/' + routeName,
          middleware ? middleware : undefinedMiddleware,
          routeHandler
        )
        break;
    }
  }

  public getRouter (): Router {
    return this._router
  }

  // public injectDbContexts = (dbcontexts: Array<DbContext>) => {
  //     const member_list: Array<string> = Object.getOwnPropertyNames(this)
  //     console.log(Object.fromEntries(this))
  //     const context_list = member_list.filter(member => member.includes("context"))
  // }
}

export const autoInjectSubRoutes = (controller: IController) => {
  const listMethods = (controller: IController): Array<string> => {
    const output: Array<string> = []
    for (var member in controller) {
      //@ts-ignore
      if (typeof controller[member] == "function") {
        if (controller.hasOwnProperty(member)) {
          output.push(member)
        }
      }
    }
    return output
  }
  const excludeBaseMethods = (methods: Array<string>): Array<string> => {
    const output: Array<string> = []
    methods.forEach((method) => {
      if (!(method.includes("_HiddenMethod") || method === "_router")) {
        output.push(method)
      }
    })
    return output
  }
  excludeBaseMethods(listMethods(controller)).forEach((method) => {
    controller.bindRouter_HiddenMethod(
      method,
      (controller as any)[method],
      controller.endpointMethod[method],
      controller.endpointMiddleware ? controller.endpointMiddleware[method] : undefined,
      controller.endpointCustomRoute ? controller.endpointCustomRoute[method] : undefined
    )
  })
}

