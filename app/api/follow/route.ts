import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const {currentUser} = await serverAuth(req);
        const body = await req.json();
        const {userId} = body;

        if(!userId || typeof userId != "string") {
            throw new Error("Invalid Id");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) {
            throw new Error("Invalid ID");
        }

        let updatedFollowingIds = [...(user.followingIds || [])];

        updatedFollowingIds.push(userId);

        try {
            await prisma.notification.create({
                data: {
                    body: "Someone followed you",
                    userId
                }
            });

            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    hasNotification: true
                }
            });
            
        } catch(error) {
            console.log(error);
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                followingIds: updatedFollowingIds
            }
        });

        return NextResponse.json(updatedUser);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to post" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {

    try {
        const {currentUser} = await serverAuth(req);
        const body = await req.json();
        const {userId} = body;

        if(!userId || typeof userId != "string") {
            throw new Error("Invalid Id");
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });

        if(!user) {
            throw new Error("Invalid ID");
        }

        let updatedFollowingIds = [...(user.followingIds || [])];

        updatedFollowingIds = updatedFollowingIds.filter(followingId => followingId != userId);

        const updatedUser = await prisma.user.update({
            where: {
                id: currentUser.id
            },
            data: {
                followingIds: updatedFollowingIds
            }
        });

        return NextResponse.json(updatedUser);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to delete" }, { status: 400 });
    }
}