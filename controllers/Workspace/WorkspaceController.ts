import Controller, { Methods } from "../../Typings/Controller";
import { Request, Response } from "express";
import Token from "../../services/TokenService/TokenService";
import Workspace from "../../models/WorkspaceModel/WorkspaceModel";
import JSONResponse from "../../Typings/JSONResponse";
import WorkspaceUser from "../../models/WorkspaceModel/WorkspaceUser";

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
            if (!req?.user?.id) {
                JSONResponse.SendError(res, "missing credentials", {
                    data: null,
                });
            } else {
                let workspaces: any = await WorkspaceUser.query()
                    .withGraphFetched(
                        "[workspace_info.owner(safeUserData), workspace_info.users(safeUserData)]"
                    )
                    .select("workspace_user.workspace_id")
                    .where({ "workspace_user.user_id": req.user.id })
                    .modifiers({
                        safeUserData(builder) {
                            builder.select(
                                "name",
                                "email",
                                "users.id",
                                "users.created_at"
                            );
                        },
                    })
                    .debug();

                JSONResponse.SendSuccess(res, "workspaces", {
                    workspaces,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
}

export default WorkspaceController;
