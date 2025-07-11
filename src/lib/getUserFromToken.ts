import jwt from "jsonwebtoken";
import { cookies as getCookies } from "next/headers";

export interface TokenPayload {
  id: string;
  username: string;
  email: string;
}

export async function getUserFromToken(): Promise<TokenPayload | null> {
  try {
    // This handles both sync and promise return types
    const cookieStore = await Promise.resolve(getCookies());
    const token = cookieStore.get("token")?.value;

    if (!token || !process.env.TOKEN_SECRET) return null;

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}