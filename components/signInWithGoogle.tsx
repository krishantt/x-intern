"use client";

import { useSession, signIn} from "next-auth/react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGoogle } from "react-icons/fa";
import MainLayout from "@/components/mainLayout";
import { useState } from "react";

import { Terminal } from "lucide-react"

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertDemo() {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You need to enter OpenAI API key to use this app.
      </AlertDescription>
    </Alert>
  )
}


export default function LoginButton() {
    const { data: session } = useSession()
    let value
    value = localStorage.getItem("apiKey") || ""
    const [apikey, setApiKey] = useState(value)
    const [invalidKey, setInvalidKey] = useState(false)

    const handleClick = () => {
        if (apikey === "") {
            setInvalidKey(true)
            return
        }
        localStorage.setItem("apiKey", apikey)
        signIn("google")
    }
    if (session) {
        return <MainLayout/>;
    }
    return (
        <>
            {invalidKey && <AlertDemo/>}
            <Input type="text" placeholder="Enter your OpenAI key..." onChange={e=> setApiKey(e.target.value)}/>
            <Button onClick={handleClick}>
                <FaGoogle className="mr-2" />
                Sign in with Google
            </Button>
        </>);
}