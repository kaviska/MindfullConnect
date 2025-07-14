"use server";

import { revalidatePath } from "next/cache";
import { User } from "./models";
import { connectToDB } from "./utils";

export const deletePatient = async (formData: FormData): Promise<void> => {
    const { id } = Object.fromEntries(formData) as { id: string };

    try {
        await connectToDB();
        await User.findByIdAndDelete(id);
    } catch (err) {
        console.error(err);
        throw new Error("Failed to delete Patient");
    }

    revalidatePath("/admind/patient");
};