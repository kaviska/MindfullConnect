import { NextResponse } from "next/server";
import { fetchResolvedReports } from "../../../lib/data";


export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const { reports, totalPages } = await fetchResolvedReports(page);
    return NextResponse.json({ reports, totalPages });
}