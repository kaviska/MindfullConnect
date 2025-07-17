import { User } from "./models";
import { Report } from "./models";
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


export const fetchPendingReports = async (page: number) => {
    await dbConnect();
    const filter = { status: "Pending" };
    const totalReports = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
        .sort({ createdAt: -1 })
        .limit(ITEMS_PER_PAGE)
        .skip(ITEMS_PER_PAGE * (page - 1))
        .lean();

    console.log("Backend fetched", reports.length, "reports");

    return {
        reports,
        totalPages: Math.ceil(totalReports / ITEMS_PER_PAGE),
    };
};

export const fetchResolvedReports = async (page: number) => {
    await dbConnect();
    const filter = { status: "Resolved" };
    const totalReports = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
        .sort({ createdAt: -1 })
        .limit(ITEMS_PER_PAGE)
        .skip(ITEMS_PER_PAGE * (page - 1))
        .lean();

    console.log("Backend fetched", reports.length, "reports");

    return {
        reports,
        totalPages: Math.ceil(totalReports / ITEMS_PER_PAGE),
    };
};