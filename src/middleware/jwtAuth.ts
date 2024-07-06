import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { Request } from '../request';
import { userModel, IUser } from '../modules/user';
import { roleModel, IRole } from '../modules/role';

export const jwtAuth = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const token: string = req.headers.authorization as string;
        if (!token) {
            return res.status(401).json({
                message: "Authorization token missing",
            });
        }

        const decode: JwtPayload | string = jwt.verify(token, process.env.SECRET_KEY || 'jwtSecretKey');
        if (typeof decode === 'string') {
            throw new Error('Invalid token');
        }

        req.tokenData = decode;

        const validUser: IUser = await userModel.findById(decode.id) as IUser;
        if (!validUser) {
            return res.status(400).json({
                message: "User Not Found",
            });
        }

        next();

    } catch (error: any) {
        console.log(error);
        res.status(500).send({
            message: "please set JWT",
            error: error.message,
        });
    }
};