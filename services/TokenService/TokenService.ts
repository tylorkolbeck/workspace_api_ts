import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
// import { ISafeUser}
import { ACCESS_TOKEN_SECRET } from "../../config";

export default class Token {
    public static Verify(
        req: Request,
        res: Response,
        next: NextFunction
    ): void {
        const header = req.headers.authorization;
        let token: string = "";

        if (!header) {
            res.json({
                data: {
                    tokenVerificationData: {
                        access: false,
                        message: "No access token provided",
                    },
                },
            });
        }
        if (header) {
            token = header.split(" ")[1];
        }

        jwt.verify(token, ACCESS_TOKEN_SECRET!, (error, decodedFromToken) => {
            if (error) {
                res.json({
                    data: {
                        tokenVerificationData: {
                            access: false,
                            message: "Failed to verfiy access token",
                        },
                    },
                });
                return;
            } else {
                const decoded = <{ user: object }>decodedFromToken;
                const decodedUser = decoded.user;
                console.log(decoded);

                console.log(">>>>", decodedUser);

                req.user = decodedUser;
                next();
            }
        });
    }
}
