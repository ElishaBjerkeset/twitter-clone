import { authOptions } from "./authOptions";
import prisma from "@/libs/prismadb";
import { getServerSession } from "next-auth";

export default async function serverAuth(req: Request) {
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