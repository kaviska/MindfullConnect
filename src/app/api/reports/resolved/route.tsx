import { NextResponse } from "next/server";
import { fetchResolvedReports } from "../../../lib/data";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;

    try {
        const { reports, totalPages } = await fetchResolvedReports(page);
        return NextResponse.json({ reports, totalPages });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching resolved reports" }, { status: 500 });
    }
}
