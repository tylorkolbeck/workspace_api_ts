import { Response, Request, NextFunction, Router } from "express";

export enum Methods {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
}

interface IRoute {
    path: string;
    method: Methods;
    handler: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => void | Promise<void>;
    localMiddleware: ((
        req: Request,
        res: Response,
        next: NextFunction
    ) => void)[];
}

abstract class Controller {
    public router: Router = Router();
    public abstract path: string;

    protected readonly routes: Array<IRoute> = [];

    public setRoutes = (): Router => {
        for (const route of this.routes) {
            for (const middleware of route.localMiddleware) {
                this.router.use(route.path, middleware);
            }

            switch (route.method) {
                case Methods.GET:
                    this.router.get(route.path, route.handler);
                    break;
                case Methods.POST:
                    this.router.post(route.path, route.handler);
                    break;
                case Methods.PUT:
                    this.router.put(route.path, route.handler);
                    break;
                case Methods.DELETE:
                    this.router.delete(route.path, route.handler);
                default:
                    console.log("not a valid REST method");
                    break;
            }
        }

        return this.router;
    };

    protected sendSuccess(res: Response, data: object): Response {
        return res.status(200).json(data);
    }

    protected sendError(res: Response, message?: string): Response {
        return res.status(500).json({
            success: false,
            message: message || "internal server error",
        });
    }
}

export default Controller;
