import express, { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
declare module "express-serve-static-core" {
  interface Request {
    user: {
      id: ObjectId;
      email: string;
      name: string;
      role: "DEALERSHIP" | "USER";
    };
  }
}
export default function authorizeRole(allowedRoles: ("DEALERSHIP" | "USER")[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user.role || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (error) {
      console.error("error authorizing role:", error);
      res.status(500).json({ message: "Internal server Error" });
    }
  };
}

// export default function authorizeRole(allowedRoles: ("DEALERSHIP" | "USER")[]) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const userRole = await getUserRole(req.user.id);
//       if (!userRole || !allowedRoles.includes(userRole)) {
//         return res.status(403).json({ message: "Forbidden" });
//       }
//       next();
//     } catch (error) {
//       console.error("Error authorizing role:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   };
// }

// const getUserRole = async (id: string): Promise<"ADMIN" | "USER" | null> => {
//   try {
//     const user = await queryUser(id);
//     return user ? user.role : null;
//   } catch (error) {
//     console.error("Error fetching user role from database:", error);
//     throw error;
//   }
// };
