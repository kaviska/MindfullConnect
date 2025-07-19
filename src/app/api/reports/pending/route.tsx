import { NextResponse } from "next/server";
import { fetchPendingReports } from "../../../lib/data";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page")) || 1;

    try {
        const { reports, totalPages } = await fetchPendingReports(page);
        return NextResponse.json({ reports, totalPages });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching pending reports" }, { status: 500 });
    }
}
