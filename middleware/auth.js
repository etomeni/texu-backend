import Jwt  from "jsonwebtoken";
import envData  from './../config/env.js';

export default async (req, res, next) => {
    try {
        const authHeader = req.get('Authorization');
    
        if (!authHeader) {
            const error = new Error("Not authenticated!");
            error.statusCode = 401;
            error.message = "Not authenticated! Please login and try again.";
    
            return res.status(401).json({
                message: error.message,
                statusCode: error.statusCode,
                error
            });
        }
    
        const token = authHeader.split(' ')[1];
        let  decodedToken;
        try {
            decodedToken = Jwt.verify(token, `${envData.secretForToken}`)
        } catch (error) {
            error.statusCode = 500;
            error.message = "wrong authentication token";
    
            return res.status(500).json({
                message: error.message,
                statusCode: error.statusCode,
                error
            });
        }
    
        if (!decodedToken) {
            const error = new Error("Not authenticated!");
            error.statusCode = 401;
            error.message = "Not authenticated! unable to verify user authtentication token.";
    
            return res.status(401).json({
                message: error.message,
                statusCode: error.statusCode,
                error
            });
        }
    
        req.isLoggedin = true;
        req.userID = decodedToken.userID;
        req.email = decodedToken.email;
        req.username = decodedToken.username;
    
        next();
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}