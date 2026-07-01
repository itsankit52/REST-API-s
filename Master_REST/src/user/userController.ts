import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt'
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";
// import { userInfo } from "node:os";

// Register user 
const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction

) => {
    const { name, email, password } = req.body;

    // Validation 
    if (!name || !email || !password) {
        const error = createHttpError(400, "All fields are required.")
        return next(error)
    }

    // Database call (check user is exist or not)
    try {
        const user = await userModel.findOne({ email })

        if (user) {
            const error = createHttpError(400, "User already exist")
            return next(error);
        }

    }  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {
        return next(createHttpError(500, "Error while getting user"))
    }

    // Password -> hash
    let newUser: User
    try {
        const hashPassword = await bcrypt.hash(password, 12)

        newUser = await userModel.create({
            name,
            email,
            password: hashPassword
        })
    }  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {
        return next(createHttpError(500, "Error while creating user"))
    }

    // Token generation - JWT
    try {
        const token = sign({ sub: newUser._id }, config.jwtSecret as string, { expiresIn: '7d' });

        res.status(201).json({
            id: newUser._id,
            accessToken: token
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {
        return next(createHttpError(500, "Error while signing jwt token "))
    }
}

// Login user 
const loginUser = async (req: Request, res: Response, next: NextFunction) => {

    const { email, password } = req.body;

    if (!email || !password) return next(createHttpError(400, "All fields are required."))

    const user = await userModel.findOne({ email });

    if (!user) return next(createHttpError(404, "User not found."));

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) return next(createHttpError(401, "Not authenticated, incorrect password "));

    // Create new access token on login time 
    try {
        const token = sign({ sub: user._id }, config.jwtSecret as string, { expiresIn: '7d' });
        res.status(201).json({ accessToken: token })
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch (err) {
        return next(createHttpError(500, "Error while signing jwt token "))
    }
}

export { createUser, loginUser };

