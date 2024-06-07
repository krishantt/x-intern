"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import EmailList from "./emailList";
import { IEmail } from "gmail-api-parse-message-ts";
import { useEffect, useState } from 'react';




export default function MainLayout() {
    const [emails, setEmails] = useState<IEmail[]>([]);
    const [response, setResponse] = useState<string>("");

    const classify = async () => {
        const response = await fetch('/api/ai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ apiKey: localStorage.getItem("apiKey"), emails: emails }),
        }
        );
        setResponse(await response.text());
    }


    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await fetch('/api/gmail');
                const data = await response.json();
                setEmails(data.emailList);
            } catch (error) {
                console.error('Error fetching emails:', error);
            }
        };

        fetchEmails();
    }, []);
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
                        <p className="text-sm">{session?.user.email}</p>
                    </div>
                </div>
                <Button onClick={() => signOut()}>Sign out</Button>
            </div>
            <div className="flex flex-row justify-between w-full">
                <Input type="number" className="w-1/12" defaultValue={3} />
                <Button onClick={() => { classify()}} variant="secondary">Classify</Button>
            </div>

            <EmailList emails={emails} />
        </>

    );
}