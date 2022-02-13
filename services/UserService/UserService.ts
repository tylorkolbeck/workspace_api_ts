import User from "../../models/UserModel/UserModel";
import * as bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../../config";
import Utility from "../../lib/Utilities";

interface AuthReturnData {
    message: string;
    success: boolean;
    data?: object;
}

interface ISafeUser {
    id: number;
    email: string;
    role: string;
}

interface ISafeData {
    user?: ISafeUser;
    jwt?: string;
}

interface IWhereQuery {
    [key: string]: string;
}

interface IRegisterData {
    email: string;
    id: number;
    name: string;
}

class UserService {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly name?: string,
        public confirmationCode?: string
    ) {}

    public async login(): Promise<AuthReturnData> {
        try {
            const userFromDb = await UserService.GetUser({ email: this.email });
            if (userFromDb) {
                const isPasswordEqual = await bcrypt.compare(
                    this.password,
                    userFromDb.password
                );
                if (isPasswordEqual) {
                    const data = this.prepareData(userFromDb);
                    return { message: "Logged In", success: true, data };
                } else {
                    return { message: "Invalid credentials", success: false };
                }
            }
            return {
                message: "succes",
                success: true,
                data: {
                    token: "SOME TOKEN",
                },
            };
        } catch (error) {
            console.log(error);
            return { message: "Invalid credentials", success: false };
        }
    }

    public async register(): Promise<AuthReturnData> {
        try {
            const userFromDb = await UserService.GetUser({ email: this.email });

            if (!userFromDb) {
                const hashedPassword = await bcrypt.hash(this.password, 8);

                const createdUser = await User.query().insert({
                    email: this.email,
                    password: hashedPassword,
                    name: this.name,
                    confirmationCode: Utility.GenerateId(),
                });

                const data = this.prepareRegisterData(createdUser);

                return {
                    message:
                        "Successfully registered, please verify your email.",
                    success: true,
                    data,
                };
            } else {
                return { message: "User already exists", success: false };
            }
        } catch (error) {
            console.log(error);
            return {
                message: "An error occured registering user",
                success: false,
            };
        }
    }

    public static async GetUser(query: IWhereQuery): Promise<User | null> {
        const user = await User.query().where(query).first();

        if (user) {
            return user;
        } else {
            return null;
        }
    }

    public static async ActivateUserAccount(
        confirmationCode: string
    ): Promise<any> {
        try {
            const rowsAffected = await User.query()
                .patch({ activated: true })
                .where({ confirmationCode });
            if (rowsAffected > 0) {
                return {
                    message: "Your account has been activated, please login.",
                    success: true,
                    data: null,
                };
            } else {
                return {
                    message:
                        "Unable to activate account, please contact the admins.",
                    success: false,
                    data: null,
                };
            }
        } catch (error) {
            console.log(error);
            return { success: false, message: "internal server error" };
        }
    }

    private prepareRegisterData(user: User): IRegisterData {
        const data: IRegisterData = {
            email: user.email,
            id: user.id,
            name: user.name,
        };

        return data;
    }

    private prepareData(user: User): ISafeData {
        const token = jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET!, {
            expiresIn: "30d",
        });
        const data: ISafeData = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            jwt: token,
        };
        return data;
    }
}

export default UserService;
