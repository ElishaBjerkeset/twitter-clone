import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const {currentUser} = await serverAuth(req);
        const body = await req.json();
        const {postId} = body;

        if(!postId || typeof postId != "string") {
            throw new Error("Invalid Id");
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        if(!post) {
            throw new Error("Invalid ID");
        }

        let updatedLikedIds = [...(post.likedIds || [])];

        updatedLikedIds.push(currentUser.id);

        const updatedPost = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                likedIds: updatedLikedIds
            }
        });

        return NextResponse.json(updatedPost);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to post" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {

    try {
        const {currentUser} = await serverAuth(req);
        const body = await req.json();
        const {postId} = body;

        if(!postId || typeof postId != "string") {
            throw new Error("Invalid Id");
        }

        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        });

        if(!post) {
            throw new Error("Invalid ID");
        }

        let updatedLikedIds = [...(post.likedIds || [])];

        updatedLikedIds = updatedLikedIds.filter((likedId) => likedId != currentUser.id)

        const updatedPost = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                likedIds: updatedLikedIds
            }
        });

        return NextResponse.json(updatedPost);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
    }
}