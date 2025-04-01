import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/libs/prismadb";

export async function POST(req: Request) {
    try {
        const { email, username, name, password } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                username,
                name,
                hashedPassword,
            },
        });

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
    }
}
