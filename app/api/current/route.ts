import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";
import { NextResponse } from "next/server";
import prisma from "@/libs/prismadb";


export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const currentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email!,
            },
        });

        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(currentUser);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}