import { authOptions } from "./authOptions";
import prisma from "@/libs/prismadb";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export default async function serverAuth(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        throw new Error("Not authenticated");
    }

    const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    if (!currentUser) {
        throw new Error("User not found");
    }

    return { currentUser };
}