import express from "express"
import { User } from "../models/user.js";
// import ErrorHandler from "../middlewares/error.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

// const router = express.Router()

const sendCookies = (user, res, message, statusCode) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    console.log(token);
    res
        .status(statusCode)
        .cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            sameSite:"none",
            secure:true,
        })
        .json({
            success: true,
            message,
        });
};
export const signup = async (req, res) => {
    try {
        // Check if the user already exists
        const { name, email, password } = req.body;
        const userExist = await User.findOne({ email });
        if(!email || !name || !password){
            res.status(500).json({ success: false, error: "email and name and password" });
        }
        console.log(userExist);
        if (userExist) {
            // User already exists
            res.status(500).json({ success: false, error: 'User already exist' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({ name, email, password: hashedPassword });

        // Send response
        sendCookies(user, res, "Registered Successfully", 201);
    } catch (error) {
        // Pass the error to the error middleware
        res.status(500).json({ success: false, error: 'User already exist' });
    }
  };


export const login= async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(500).json({ success: false, error: 'Invalid' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(500).json({ success: false, error: 'Invalid' });
            // const error = new ErrorHandler("Invalid Email or Password", 401);
            // return next(error);
        }

        // Successful login
        sendCookies(user, res, `Welcome back`, 200);
    } catch (error) {
        // Pass the error to the error middleware
        return res.status(500).json({ success: false, error: 'Invalid' });
    }
};


export const logout= (req, res) => {
    res
        .status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            maxAge: 1000 * 60 * 15,
        })
        .json({
            success: true,
            user: req.user,
        });

}