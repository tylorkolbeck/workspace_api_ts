import jwt, { RequestHandler } from "express-jwt";

const jwtMiddleware = (): RequestHandler =>
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    credentialsRequired: false,
  });

module.exports = jwtMiddleware;
