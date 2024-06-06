"use client";

import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import MainLayout from "@/components/mainLayout";

export default function LoginButton() {
    const { data: session } = useSession()
    if (session) {
        return <MainLayout/>;
    }
    return (
        <>
            <Button onClick={() => signIn('google')}>
                <FaGoogle className="mr-2" />
                Sign in with Google
            </Button>
        </>);
}