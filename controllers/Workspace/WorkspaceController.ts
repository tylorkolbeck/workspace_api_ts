import Controller, { Methods } from "../../Typings/Controller";
import { Request, Response, NextFunction } from "express";
import Token from "../../services/TokenService/TokenService";

class WorkspaceController extends Controller {
    path = "/workspaces";
    routes = [
        {
            path: "/",
            method: Methods.GET,
            handler: this.handleGetWorkspaces,
            localMiddleware: [Token.Verify],
        },
    ];

    constructor() {
        super();
    }

    async handleGetWorkspaces(req: Request, res: Response): Promise<void> {
        try {
            console.log(">>>>", req.user);
            super.sendSuccess(res, { message: "GETTING WORKSPACES" });
        } catch (error) {
            console.log(error);
        }
    }
}

export default WorkspaceController;
