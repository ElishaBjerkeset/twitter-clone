import Header from "@/components/Header";
import NotificationsFeed from "@/components/NotificationsFeed";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function NotificationsPage() {
    const session = getServerSession(authOptions);

    if (!session) {
        redirect("/");
    }

    return ( 
        <>
            <Header label="Notifications" showBackArrow />
            <NotificationsFeed  />
        </>
    );
}
