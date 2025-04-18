import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    try {
        const { userId } = await params;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Invalid Id" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const followersCount = await prisma.user.count({
            where: {
                followingIds: {
                    has: userId
                }
            }
        });

        return NextResponse.json({ ...existingUser, followersCount });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}
