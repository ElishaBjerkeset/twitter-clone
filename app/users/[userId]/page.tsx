"use client";

import Header from "@/components/Header";
import { useParams } from "next/navigation";
import {ClipLoader} from "react-spinners";
import useUser from "@/hooks/useUser";
import UserHero from "@/components/users/UserHero";
import UserBio from "@/components/users/UserBio";

const UserView = () => {
    const { userId } = useParams();

    const {data: fetchedUser, isLoading} = useUser(userId as string);

    if(isLoading || !fetchedUser) {
        return (
            <div className="flex justify-center items-center h-full">
                <ClipLoader color="lightblue" size={80}/>
            </div>
        )
    }
    return ( 
        <>
            <Header showBackArrow label={fetchedUser?.name}/>
            <UserHero userId={userId as string} />
            <UserBio userId={userId as string} />
        </>
     );
}
 
export default UserView;