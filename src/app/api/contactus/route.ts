import { NextResponse } from "next/server";
import ContactUs from "@/models/contactus";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
    await dbConnect();
    const body = await req.json();
    try {
        const contact = new ContactUs(body);
        await contact.save();
        return NextResponse.json({ success: true, contact });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
