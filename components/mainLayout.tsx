"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EmailList from "./emailList";

export default function MainLayout() {
    let value
    value = localStorage.getItem("apiKey") || ""
    const { data: session } = useSession()
    return (
        <>
            <div className="flex flex-row justify-between w-full">
                <div className="flex flex-row space-x-5">
                    <Avatar>
                        <AvatarImage src={session?.user?.image as string} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start justify-start">
                        <h1 className="text-xl font-bold">{session?.user.name}</h1>
                        <p className="text-sm">{session?.user.email }</p>
                    </div>
                </div>
                <Button onClick={() => signOut()}>Sign out</Button>
            </div>
            <div className="flex flex-row justify-between w-full">
                <Input type="number" className="w-1/12"/>
                <Button onClick={() => {}} variant="secondary">Classify</Button>
            </div>
            <EmailList/>
        </>

    );
}