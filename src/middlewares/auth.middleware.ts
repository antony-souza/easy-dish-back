import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma.connect.js";
import { getEnvField } from "../config/env.config.js";
import type { IUserAuth } from "../_types/user-auth.type.js";

export const needAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).send({ message: "Não autenticado" });
        return
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        res.status(401).send({ message: "Não autenticado" });
        return
    }

    let userDecoded: { user: IUserAuth };
    
    try {
        userDecoded = jwt.verify(token, getEnvField.JWT_SECRET) as { user: IUserAuth }
    } catch {
        res.status(401).send({ message: "Sessão expirada. Por favor, faça login novamente." });
        return;
    }

    const userFound = await prisma.user.findUnique({
        where: {
            id: userDecoded.user.id,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            roleId: true,
            companyId: true,
        },
    });

    if (!userFound) {
        res.status(401).send({ message: "Não autenticado" });
        return;
    }

    req.user = userFound;

    next();
};