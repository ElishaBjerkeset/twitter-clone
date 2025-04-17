import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const {currentUser} = await serverAuth(req);
        const {body} = await req.json();
        //const {postId} = req.query;  Old way of doing it
        const { searchParams } = new URL(req.url);
        const postId = searchParams.get('postId');

        if(!postId || typeof postId != "string") {
            throw new Error("Invalid Id");
        }

        const comment = await prisma.comment.create({
            data: {
                body,
                userId: currentUser.id,
                postId
            }
        });

        return NextResponse.json(comment);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to comment" }, { status: 400 });
    }
}