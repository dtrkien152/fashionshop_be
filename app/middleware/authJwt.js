import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import {AuthService} from "../services/authService.js";
import {ROLE_USER} from "../constant/constant.js";
const authService = new AuthService(); // Khởi tạo instance
const verifyToken = (req, res, next) => {
    let token = req.session?.token;

    if (!token) {
        return res.status(403).json({message: "No token provided!"});
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).json({message: "Unauthorized!"});
        }
        req.userId = decoded.id;
        next();
    });
};

// ✅ Kiểm tra quyền
const checkRole = (roleNames) => {
    return async (req, res, next) => {
        try {
            const roles = await authService.getRole(req.userId);
            if (roles.some((role) => roleNames.includes(role))) {
                return next();
            }
            res.status(403).json({message: `Require ${roleNames.join(" or ")} Role!`});
        } catch (error) {
            console.error("Role validation error:", error);
            res.status(500).json({message: "Unable to validate user role!"});
        }
    };
};


const authJwt = {
    verifyToken,
    isUser:checkRole(ROLE_USER),
    isAdmin: checkRole(["admin"]),
    isModerator: checkRole(["moderator"]),
    isModeratorOrAdmin: checkRole(["moderator", "admin"]),
};
export default authJwt;
