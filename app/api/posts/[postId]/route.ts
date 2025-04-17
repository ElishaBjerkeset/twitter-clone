import prisma from "@/libs/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { postId: string } }) {
    try {
        const { postId } = await params;

        if (!postId || typeof postId !== "string") {
            return NextResponse.json({ error: "Invalid post" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            },
            include: {
                user: true,
                comments: {
                    include: {
                        user: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
    }
}
