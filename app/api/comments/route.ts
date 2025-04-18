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

        try {
            const post = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            });

            if(post?.userId) {
                await prisma.notification.create({
                    data: {
                        body: "Someone replied your tweet",
                        userId: post.userId
                    }
                });

                await prisma.user.update({
                    where: {
                        id: post.userId
                    },
                    data: {
                        hasNotification: true
                    }
                });
            }
        } catch(error) {
            console.log(error);
        }

        return NextResponse.json(comment);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to comment" }, { status: 400 });
    }
}