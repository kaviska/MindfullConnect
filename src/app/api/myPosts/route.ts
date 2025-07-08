import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Post from "@/models/postModel";
import { getUserIdFromToken } from "@/lib/getUserFromId";

export async function GET() {
  await connect();

  const userId = await getUserIdFromToken();  // await here as well!

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await Post.find({ author: userId }).populate('author', 'username email');
    return NextResponse.json(posts);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to fetch user's posts" }, { status: 500 });
  }
}
