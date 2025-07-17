import { NextResponse } from "next/server";
import dbConnect from "../../../lib/utils";
import { Payment } from "../../../lib/models";
import { subMonths, startOfMonth } from "date-fns";

export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        const endDate = startOfMonth(now); // start of current month
        const startDate = subMonths(endDate, 6); // 6 months ago

        // Only include payments from the last 6 completed months
        const earnings = await Payment.aggregate([
            {
                $match: {
                    status: "Success",
                    transactionDate: { $gte: startDate, $lt: endDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$transactionDate" },
                        month: { $month: "$transactionDate" },
                    },
                    total: { $sum: "$amount" },
                },
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 },
            },
        ]);

        // Format for recharts: last 6 completed months
        const formatted = Array.from({ length: 6 }, (_, i) => {
            const date = subMonths(endDate, 5 - i);
            const match = earnings.find(
                e =>
                    e._id.year === date.getFullYear() &&
                    e._id.month === date.getMonth() + 1
            );
            return {
                month: date.toLocaleString("default", { month: "long" }),
                total: match ? match.total : 0,
            };
        });

        return NextResponse.json(formatted);
    } catch (err) {
        console.error("Monthly earnings fetch error:", err);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
