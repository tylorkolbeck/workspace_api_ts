import Controller, { Methods } from "../../Typings/Controller";
import { Request, Response } from "express";
import Token from "../../services/TokenService/TokenService";
import Workspace from "../../models/WorkspaceModel/WorkspaceModel";
import JSONResponse from "../../Typings/JSONResponse";

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

    private async handleGetWorkspaces(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const ownedWorkspace: any = await Workspace.query()
                .where({
                    user_id: req.user.id,
                })
                .withGraphFetched("users(safeUserData)")
                .modifiers({
                    safeUserData(builder) {
                        builder.select(
                            "name",
                            "email",
                            "users.id",
                            "users.created_at"
                        );
                    },
                });

            // const joinedWorspaces: get workspaces that this user is a part of here
            JSONResponse.SendSuccess(res, "Owned workspaces", ownedWorkspace);
        } catch (error) {
            console.log(error);
        }
    }
}

export default WorkspaceController;
