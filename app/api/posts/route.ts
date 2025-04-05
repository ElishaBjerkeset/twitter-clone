import prisma from "@/libs/prismadb";
import serverAuth from "@/libs/serverAuth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    try {
        const {currentUser} = await serverAuth(req);
        const bodyContent = await req.json();
        const {body} = bodyContent;

        const post = await prisma.post.create({
            data: {
                body,
                userId: currentUser.id
            }
        });

        return NextResponse.json(post);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "POST failure" }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {

    try {
        const userId = req.nextUrl.searchParams.get("userId");
        
        let posts;

        if(userId && typeof userId == "string") {
            posts = await prisma.post.findMany({
                where: {
                    userId
                }, 
                include: {
                    user: true,
                    comments: true
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        } else {
            posts = await prisma.post.findMany({
                include: {
                    user: true, 
                    comments: true,
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }


        return NextResponse.json(posts);
    } catch(error) {
        console.log(error);
        return NextResponse.json({ error: "Get Failure" }, { status: 400 });
    }
}