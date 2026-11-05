import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Request, Response, NextFunction } from "express";

const jwks = createRemoteJWKSet(new URL(process.env.BETTER_AUTH_JWKS_URL!));

export type AuthRequest = Request & {
  user?: { id?: string; email?: string; name?: string };
};

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "Authentication required." });

  try {
    const token = header.slice(7);
    const { payload } = await jwtVerify(token, jwks, {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    });

    req.user = {
      id: typeof payload.sub === "string" ? payload.sub : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      name: typeof payload.name === "string" ? payload.name : undefined
    };
if (!req.user.email) return res.status(401).json({ message: "Token does not contain a user email." });
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}
    
