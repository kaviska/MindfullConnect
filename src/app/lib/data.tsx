import User from "../models/User";
import Report from "../models/report";
import dbConnect from "./mongodb";
import { Types } from "mongoose";

const ITEMS_PER_PAGE = 8;

export const fetchPatients = async (q: string, page: number) => {
    const regex = new RegExp(q, "i");

    try {
        await dbConnect();

        const filter = {
            role: "patient",
            firstname: { $regex: regex }
        };

        console.log("Fetching users with filter:", filter);

        const totalUsers = await User.countDocuments(filter);

        console.log("Total users found:", totalUsers);

        const users = await User.find(filter)
            .limit(ITEMS_PER_PAGE)
            .skip(ITEMS_PER_PAGE * (page - 1));

        console.log("Patients fetched:", users.length);

        return {
            users: JSON.parse(JSON.stringify(users)),
            totalPages: Math.ceil(totalUsers / ITEMS_PER_PAGE),
        };
    } catch (err) {
        throw new Error("Failed to fetch patieents");
    }
};

export const fetchPatient = async (id: string) => {
    try {
        await dbConnect();

        // Validate ObjectId
        if (!Types.ObjectId.isValid(id)) {
            console.error("Invalid ObjectId:", id);
            return null;
        }

        const user = await User.findOne({ _id: id, role: "patient" }).lean(); // Filter by role: "patient"
        if (!user) {
            console.error("Patient not found for ID:", id);
            return null;
        }

        return user;
    } catch (err) {
        console.error("fetchPatient error:", err);
        return null;
    }
};

export async function fetchPendingReports(page: number) {
    await dbConnect();
    const limit = 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find({ status: "Pending" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Report.countDocuments({ status: "Pending" });
    const totalPages = Math.ceil(total / limit);

    return { reports, totalPages };
}

export async function fetchResolvedReports(page: number) {
    await dbConnect();
    const limit = 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find({ status: "Resolved" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Report.countDocuments({ status: "Resolved" });
    const totalPages = Math.ceil(total / limit);

    return { reports, totalPages };
}
