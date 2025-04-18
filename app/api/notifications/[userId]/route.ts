import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(
    request: Request, 
    { params }: { params: { userId: string }}) {
    try {
        const { userId } = params;

        if (!userId || typeof userId !== "string") {
            return NextResponse.json({ error: "Invalid user" }, { status: 400 });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                userId
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        await prisma.user.update({
            where: {
                id: userId
            }, 
            data: {
                hasNotification: false
            }
        });

        return NextResponse.json(notifications || []);
    } catch (error) {
        console.error("Error with notification", error);
        return NextResponse.json({ error: "Failed to notify" }, { status: 400 });
    }
}
