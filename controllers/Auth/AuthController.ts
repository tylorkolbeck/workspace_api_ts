import Controller, { Methods } from "../../Typings/Controller";
import { Request, Response, NextFunction } from "express";
import UserService from "../../services/UserService/UserService";

class AuthController extends Controller {
    path = "/auth/";
    routes = [
        {
            path: "/login",
            method: Methods.POST,
            handler: this.handleLogin,
            localMiddleware: [UserService.IsActivated],
        },
        {
            path: "/register",
            method: Methods.POST,
            handler: this.handleRegister,
            localMiddleware: [],
        },
        {
            path: "/activate",
            method: Methods.PUT,
            handler: this.handleActivate,
            localMiddleware: [],
        },
    ];

    constructor() {
        super();
    }

    async handleLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                super.sendError(
                    res,
                    "Missing required fields: email, password"
                );
                return;
            }
            const userService: UserService = new UserService(email, password);
            const data = await userService.login();

            if (data.success) {
                console.log(res);
                super.sendSuccess(res, data.message, data);
            } else {
                super.sendError(res, data.message);
            }
        } catch (error) {
            console.log(error);
            super.sendError(res);
        }
    }

    async handleRegister(req: Request, res: Response): Promise<void> {
        try {
            const { email, password, name } = req.body;
            if (!email || !password || !name) {
                super.sendError(
                    res,
                    "Missing required fields: email, password, name"
                );
                return;
            }
            const userService: UserService = new UserService(
                email,
                password,
                name
            );
            const data = await userService.register();

            if (data.success) {
                super.sendSuccess(res, "Account registered", data);
            } else {
                super.sendError(res, data.message);
            }
        } catch (error) {
            super.sendError(res, "Internal server error");
        }
    }

    async handleActivate(req: Request, res: Response) {
        try {
            const confirmationCode = req.query.confirmationCode as string;
            if (!confirmationCode) {
                super.sendError(res, "No confirmation code provided");
                return;
            } else {
                const data = await UserService.ActivateUserAccount(
                    confirmationCode
                );
                super.sendSuccess(res, "Account Activated", data);
            }
        } catch (error) {
            console.log(error);
            super.sendError(res, "internal server error");
        }
    }
}

export default AuthController;
