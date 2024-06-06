"use client";

import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";


export default function MainLayout() {
    const { data: session } = useSession()
    return (
        <>
            Signed in as {session?.user?.email as string}.
            <br />
            <Button onClick={() => signOut()}>

                Sign out
            </Button>
        </>);
}