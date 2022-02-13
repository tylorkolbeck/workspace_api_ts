import * as dotenv from "dotenv";

dotenv.config();

export const PORT = parseInt(process.env.PORT!);
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const NODE_ENV = process.env.NODE_ENV;
