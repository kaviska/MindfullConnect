import { User } from "./models";
import { connectToDB } from "./utils";

const ITEMS_PER_PAGE = 10;

export const fetchUsers = async (q: string, page: number) => {
    const regex = new RegExp(q, "i");

    try {
        await connectToDB();

        const filter = {
            role: "patient",
            firstname: { $regex: regex }
        };

        const totalUsers = await User.countDocuments(filter);

        const users = await User.find(filter)
            .limit(ITEMS_PER_PAGE)
            .skip(ITEMS_PER_PAGE * (page - 1));

        return {
            users: JSON.parse(JSON.stringify(users)),
            totalPages: Math.ceil(totalUsers / ITEMS_PER_PAGE),
        };
    } catch (err) {
        throw new Error("Failed to fetch users");
    }
};

export const fetchUser = async (id: string) => {
    try {
        await connectToDB();
        const user = await User.findById(id).lean(); // Use lean() for cleaner JSON
        return user;
    } catch (err) {
        console.error("fetchUser error:", err);
        return null;
    }
};
