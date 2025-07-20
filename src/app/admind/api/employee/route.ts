import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Admin from "../../../models/Admin"; // Adjust path if needed

export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const q = searchParams.get("q") || "";
  const pageSize = 10;

  const query: any = { isSuperAdmin: false };

  if (q.length > 2) {
    query.$or = [
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }

  const totalUsers = await Admin.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / pageSize);

  const users = await Admin.find(query)
    .skip((page - 1) * pageSize)
    .limit(pageSize);

  return NextResponse.json({ users, totalPages });
}
