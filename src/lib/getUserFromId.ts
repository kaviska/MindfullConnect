import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function getUserIdFromToken(): Promise<string | null> {
  const cookieStore = await cookies();  // await here!
  const token = cookieStore.get("token")?.value;

  if (!token || !process.env.TOKEN_SECRET) return null;

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as { id: string };
    return decoded.id;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}
