import { NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {
  const user = getUserFromToken();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}