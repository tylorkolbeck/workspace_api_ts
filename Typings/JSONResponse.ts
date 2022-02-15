import { Response } from "express";

export default class JSONResponse {
    constructor() {}

    static SendSuccess(res: Response, message: string, data: object): void {
        res.status(200).json({
            success: true,
            message: message || "",
            data,
        });
    }

    static SendError(
        res: Response,
        message: string,
        data: object | null
    ): void {
        res.status(500).json({
            success: false,
            message: message || "internal server error",
            data: data || null,
        });
    }
}
