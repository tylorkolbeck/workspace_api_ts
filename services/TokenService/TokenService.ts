import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
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
                const decoded = <{ id: string; email: string; role: string }>(
                    decodedFromToken
                );
                const { id, email, role } = decoded;

                req.user = {
                    id,
                    email,
                    role,
                };
                next();
            }
        });
    }
}
