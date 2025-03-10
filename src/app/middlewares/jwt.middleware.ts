import { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { container } from '../config';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from '../services';
import { ROLE } from '../constants';

const authService = container.resolve(AuthService);

const verifyToken = (req: Request, res: Response, next: NextFunction): Promise<any> | void => {
  let token = req.header("Authorization")?.split(" ")[1]; // Expecting 'Bearer <token>'

  if (!token) {
    return Promise.resolve(res.status(403).json({ message: 'No token provided!' }));
  }

  authService.decodeToken(token, (err: VerifyErrors, decoded: JwtPayload) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized!' });
    }
    req.session['userId'] = decoded.sub;
    req.session['email'] = decoded['email'];
    req.session['role'] = decoded['role'];
    next();
  });
};

// ✅ Kiểm tra quyền
const checkRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = req.session['role'];
      if (roles.includes(role)) {
        return next();
      }
      res.status(403).json({ message: `Require ${roles.join(' or ')} Role!` });
    } catch (error) {
      console.error('Role validation error:', error);
      res.status(500).json({ message: 'Unable to validate user role!' });
    }
  };
};


const jwtMiddleware = {
  verifyToken,
  isUser: checkRole([ROLE.USER]),
  isAdmin: checkRole([ROLE.ADMIN]),
};
export default jwtMiddleware;
